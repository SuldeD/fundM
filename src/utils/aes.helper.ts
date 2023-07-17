import CryptoJS from "crypto-js";

const key1_ = "c8CfdYcxdJLcJhW6XpKu";
const key2_ = "hJNdk55TRruTqR5YxzwB";
const key3_ = "uFusGUGbQmxeT8nqbSRs";

const bytes = CryptoJS.SHA1(key1_).toString();
const key = CryptoJS.SHA1(key2_ + bytes).toString();

const stringify = (cipherParams: any) => {
  const data: any = {
    ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64),
  };
  if (cipherParams.iv) data.iv = cipherParams.iv.toString();
  if (cipherParams.salt) data.s = cipherParams.salt.toString();
  return JSON.stringify(data);
};

const parse = (jsonStr: string) => {
  const data = JSON.parse(jsonStr);
  const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: CryptoJS.enc.Base64.parse(data.ct),
  });
  if (data.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(data.iv);
  if (data.s) cipherParams.salt = CryptoJS.enc.Hex.parse(data.s);
  return cipherParams;
};

export const encrypt = (request: any) => {
  return CryptoJS.AES.encrypt(JSON.stringify(request), key, {
    format: { stringify, parse },
  }).toString();
};

export const decrypt = (response: any) => {
  try {
    return JSON.parse(
      CryptoJS.AES.decrypt(
        typeof response === "object" ? JSON.stringify(response) : response,
        key,
        {
          format: { stringify, parse },
        }
      ).toString(CryptoJS.enc.Utf8)
    );
  } catch (e) {
    console.log("decrypt error: ", e);
    return null;
  }
};
