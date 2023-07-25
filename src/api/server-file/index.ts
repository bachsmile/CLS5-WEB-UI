const ServerFileService = {
  /** server file */
  SERVERFILE: 'https://sfv4.cloudlms.top/api/File/upload',
  GetInforFile: '/api/File/Info/',
  GetCdnVideoTime: '/sfv4/api/File/duration-cdn',
  GetBlobFile: (SERVERFILE: any, serverCode: any, folder: any) => `${SERVERFILE}/${serverCode ?? 'sfv4'}/api/File/downloadDocument/${folder}`,

  /** post */
  UploadFile: '/api/File/upload',
  UploadFileImgBase64: '/api/File/captureImage',
  UploadFileCnd: '/api/File/upload-cdn',
}

export default ServerFileService
