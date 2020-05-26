/* eslint-disable */
import  OSS from 'ali-oss';
import dayjs from 'dayjs';
import { getSts } from '@/api/daliy-operation/content.js';

 const getClient = async () => {
  // https://github.com/ali-sdk/ali-oss/blob/9e46894ce55bbf4a3d0244e9c24e9e0f16ee78b1/UPGRADING.md
  let res =  await getSts()
  const resCon = res.data
  const client = new OSS({
    accessKeyId: resCon.data.AccessKeyId,
    accessKeySecret: resCon.data.AccessKeySecret,
    stsToken: resCon.data.SecurityToken,
    bucket: 'azure-ribbon-images',
    region: 'cn-shanghai',
    endpoint: 'https://oss-cn-shanghai.aliyuncs.com',
  });
  return client
};

const UUID = () => {
  const s = [];
  const hexDigits = "0123456789abcdef";
  for (let i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);

  s[8] = s[13] = s[18] = s[23] = "";
  let uuid = s.join("");
  return uuid;
};

const uploader = async (dir, files) => {
  // https://github.com/ali-sdk/ali-oss/blob/master/example/src/main.js\
  const client = await getClient()
  const options = {
    meta: { year: 2019 },
    timeout: 60000
  }
  const filesRequest = files.map((file) => {
    const today = dayjs(new Date()).format('YYYY/MM/DD');
    let newName = today + '/' + UUID()
    newName += file.name.substring(file.name.lastIndexOf('.'));
    console.log(client)
    return client.multipartUpload(dir + newName, file, options)
  })
  return Promise.all(filesRequest)
};

const downloader = (data, cb) => {
  const sendData = (client) => {
    const url = client.signatureUrl(data, {expires: 3600});
    cb(url);
  };
  getKey('', sendData);
};

const view = (prefix, cb) => {
  const cbParam = (client) => {
    const result = client.list({
      prefix: prefix
    });
    cb(result);
  };
  getKey('', cbParam);
};

const openDownloadWin = (url) => {
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('id', 'camnpr');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export default { uploader, downloader, view, openDownloadWin };
