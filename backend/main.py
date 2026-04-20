import io
import math
import random
import numpy as np
from PIL import Image
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def cover_stegno_mse(arr,emb_arr):
  mse = 0.0
  height, width, d = emb_arr.shape
  for i in range(height):
    for j in range(width):
      for k in range(3):
        # Using float() ensures no unsigned integer overflow issues and helps the type checker
        mse += math.pow(float(arr[i][j][k]) - float(emb_arr[i][j][k]), 2)
  mse = float(mse) / (width * height * 3)
  return mse

def rmse(mse):
  if mse==0:
    return 0
  return math.sqrt(mse)

def psnr(arr,mse):
  if mse==0:
    return 0
  max_sq = math.pow(np.max(arr),2)
  return 10*(math.log10(max_sq/mse))

def entropy(arr):
  freq = {}
  width =len(arr)
  height = len(arr[0])
  total = width*height*3
  arr = arr.flatten()
  for i in arr:
    if i in freq:
      freq[i]+=1
    else:
      freq[i]=1
  entropy = 0
  for count in freq.values():
    p = count/total
    if p==0:
      continue
    entropy += p * math.log2(p)
  entropy*=-1
  return entropy

def correlation_coefficient(arr,emb_arr):
  arr = arr.flatten()
  emb_arr = emb_arr.flatten()
  cov = np.cov(arr,emb_arr,ddof=0)[0,1]
  r = cov/((np.std(arr,ddof=0)*np.std(emb_arr,ddof=0)))
  return r

def num_pix_change_rate(arr,stg):
  width= len(arr)
  height = len(arr[0])
  length = width*height*3
  a=0
  for i in range(width):
    for j in range(height):
      for k in range(3):
        a+=abs(arr[i][j][k]- stg[i][j][k])
  npcr = a/length
  return npcr

def uni_avg_chg_int(arr,stg):
  width= len(arr)
  height = len(arr[0])
  length = width*height*3
  a=0
  for i in range(width):
    for j in range(height):
      for k in range(3):
        dif = abs(arr[i][j][k]- stg[i][j][k])
        if max(arr[i][j][k],stg[i][j][k])==0:
          break
        mx = max(arr[i][j][k],stg[i][j][k])
        a+= dif/mx
  uaci = a/length
  return uaci

def str_content(arr,stg):
  width= len(arr)
  height = len(arr[0])
  co=st=0
  for i in range(width):
    for j in range(height):
      for k in range(3):
        co+=arr[i][j][k]*arr[i][j][k]
        st+=stg[i][j][k]*stg[i][j][k]
  if st==0: return 0
  sc=co/st
  return sc

def img_to_arr(img):
  return np.array(img,"int64")

def header_content(width,height,key,pad):
  header = format(width, '016b') + format(height, '016b') + format(key,'016b') + format(pad,'02b') + format(0,'014b')
  return header

def array_to_bin(arr):
  bin_msg = ""
  for i in arr:
    bin_msg += format(int(i),"08b")
  return bin_msg

def rev_swap(bin_msg):
  a=""
  n= len(bin_msg)
  for i in range(0,n,8):
    h=bin_msg[i:i+8]
    h = h[::-1]
    for j in range(0,8,2):
      a+=h[j+1]
      a+=h[j]
  return a

def three_bit_lsb(img,bin_msg):
  arr = img_to_arr(img)
  index = 0
  i=0
  length=len(bin_msg)
  width = len(arr)
  height = len(arr[0])
  while(i<width and index<length):
    j=0
    while(j<height and index<length):
      k=0
      while(k<3 and index<length):
        h = bin_msg[index:index+3]
        m = format( arr[i][j][k]%8 ,"03b")
        if h > m :
          c = int(h,2) - int(m,2)
          arr[i][j][k] += c
        elif h < m :
          c = int(m,2) - int(h,2)
          arr[i][j][k] -= c
        else:
          pass
        index+=3
        k+=1
      j+=1
    i+=1
  return arr

def bin_extract(emb_arr,length):
  lsb = ""
  index = 0
  i=0
  width = len(emb_arr)
  height = len(emb_arr[0])
  while(i<width and index<length):
    j=0
    while(j<height and index<length):
      k=0
      while(k<3 and index<length):
        h = emb_arr[i][j][k]%8
        lsb += format(h,"03b")
        index+=3
        k+=1
      j+=1
    i+=1
  return lsb

def swap_rev(bin_msg):
  a=""
  n=len(bin_msg)
  for i in range(0,n,8):
    t=""
    h=bin_msg[i:i+8]
    for j in range(0,8,2):
      t+=h[j+1]
      t+=h[j]
    a+=t[::-1]
  return a

def bin_to_array(bin):
  a=[]
  n=len(bin)
  for i in range(0,n,8):
    h=bin[i:i+8]
    e = int(h,2)
    a.append(e)
  return a

def session_key_gen():
  session_key = random.randint(1000,65535)
  return session_key

def session_key_hash(arr,key):
  sin_arr = arr.flatten()
  n = len(sin_arr)
  for i in range(n):
    value = sin_arr[i] ^ key
    key = value
  return key

header_len = 64
hash_len = 16

@app.post("/api/embed")
async def embed_image(cover_image: UploadFile = File(...), secret_image: UploadFile = File(...)):
    try:
        cover_bytes = await cover_image.read()
        secret_bytes = await secret_image.read()
        
        img = Image.open(io.BytesIO(cover_bytes)).convert("RGB")
        width, height = img.size
        arr = img_to_arr(img)
        img_len = width * height * 3
        
        hid_img = Image.open(io.BytesIO(secret_bytes)).convert("RGB")
        h_width, h_height = hid_img.size
        hid_arr = img_to_arr(hid_img)
        hid_len = h_width * h_height * 3
        
        # Cover image capacity relies on 3 bits per channel for 3 channels (R,G,B).
        total_capacity_bits = img_len * 3
        required_bits = hid_len * 8 + header_len + hash_len + 2 # max 2 pad bits
        if total_capacity_bits < required_bits:
            raise HTTPException(status_code=400, detail="Insufficient Storage: Cover image is too small to embed the secret image.")
        
        session_key = session_key_gen()
        hid_arr_flat = hid_arr.flatten()
        img_bin = array_to_bin(hid_arr_flat)
        img_bin = rev_swap(img_bin)
        
        pad = 0
        v = len(img_bin) + header_len + hash_len
        if v % 3 == 1:
            img_bin += "00"
            pad = 1
        elif v % 3 == 2:
            img_bin += "0"
            pad = 2
            
        header = header_content(h_width, h_height, session_key, pad)
        hash_value_int = session_key_hash(hid_arr, session_key)
        hash_value = format(hash_value_int, "016b")
        
        img_bin = header + img_bin + hash_value
        emb_arr = three_bit_lsb(img, img_bin)
        
        emb_arr_uint8 = emb_arr.astype(np.uint8)
        stego_image_pil = Image.fromarray(emb_arr_uint8)
        
        output_io = io.BytesIO()
        stego_image_pil.save(output_io, format="PNG")
        output_io.seek(0)
        
        return StreamingResponse(output_io, media_type="image/png", headers={"Content-Disposition": "attachment; filename=stego_image.png"})
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/extract")
async def extract_image(stego_image: UploadFile = File(...)):
    try:
        stego_bytes = await stego_image.read()
        img = Image.open(io.BytesIO(stego_bytes)).convert("RGB")
        emb_arr = img_to_arr(img)
        
        header = bin_extract(emb_arr, header_len)
        hid_img_width = int(header[:16], 2)
        hid_img_height = int(header[16:32], 2)
        session_key = int(header[32:48], 2)
        pad = int(header[48:50], 2)
        
        length = hid_img_width * hid_img_height * 3 * 8
        pad_bits = 2 if pad == 1 else (1 if pad == 2 else 0)
        total_bits = header_len + length + pad_bits + hash_len
        ext_bin = bin_extract(emb_arr, total_bits)
        
        payload_with_hash = ext_bin[header_len:]
        hash_bin = payload_with_hash[-hash_len:]
        payload = payload_with_hash[:-hash_len]
        img_bin = payload[:length]
        
        hash_value = int(hash_bin, 2)
        rev_bin = swap_rev(img_bin)
        
        arr1 = bin_to_array(rev_bin)
        arr1 = np.array(arr1)
        
        expected_size = hid_img_height * hid_img_width * 3
        if len(arr1) != expected_size:
            raise HTTPException(status_code=400, detail=f"Image extraction truncated. Expected {expected_size} elements but got {len(arr1)}. The original cover image was likely too small to hold the secret image.")
            
        hid_arr = arr1.reshape(hid_img_height, hid_img_width, 3)
        new_hash = session_key_hash(hid_arr, session_key)
        
        if hash_value != new_hash:
            raise HTTPException(status_code=400, detail="Integrity Check Failed: Extracted hash does not match stored hash.")
            
        hid_arr_uint8 = hid_arr.astype(np.uint8)
        extracted_image_pil = Image.fromarray(hid_arr_uint8)
        
        output_io = io.BytesIO()
        extracted_image_pil.save(output_io, format="PNG")
        output_io.seek(0)
        
        return StreamingResponse(output_io, media_type="image/png", headers={"Content-Disposition": "attachment; filename=extracted_secret.png"})
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze")
async def analyze_image(cover_image: UploadFile = File(...), stego_image: UploadFile = File(...)):
    try:
        cover_bytes = await cover_image.read()
        stego_bytes = await stego_image.read()
        
        cover_img = Image.open(io.BytesIO(cover_bytes)).convert("RGB")
        stego_img = Image.open(io.BytesIO(stego_bytes)).convert("RGB")
        
        arr = img_to_arr(cover_img)
        emb_arr = img_to_arr(stego_img)
        
        mse_val = cover_stegno_mse(arr, emb_arr)
        rmse_val = rmse(mse_val)
        psnr_val = psnr(arr, mse_val) if mse_val > 0 else float('inf')
        
        ent_cov = entropy(arr)
        ent_stg = entropy(emb_arr)
        
        corr_val = correlation_coefficient(arr, emb_arr)
        npcr_val = num_pix_change_rate(arr, emb_arr)
        sc_val = str_content(arr, emb_arr)
        uaci_val = uni_avg_chg_int(arr, emb_arr)
        
        return {
            "MSE": f"{mse_val:.6f}",
            "RMSE": f"{rmse_val:.6f}",
            "PSNR": "Infinity" if mse_val == 0 else f"{psnr_val:.2f} dB",
            "Entropy": f"{abs(ent_cov - ent_stg):.6f}",
            "Correlation": f"{corr_val:.6f}",
            "NPCR": f"{npcr_val:.4f}%",
            "SC": f"{sc_val:.6f}",
            "UACI": f"{uaci_val:.6f}"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))