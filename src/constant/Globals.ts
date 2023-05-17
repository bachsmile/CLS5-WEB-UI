const Globals = Object.freeze({
  Date_FORMAT: 'YYY-MM-DD',
  PAGINATION_PAGE_SIZE_DEFAULT: 10, // Số lượng mặt định của một page table
  PAGINATION_PAGE_SIZE_DEFAULT_OPTION: [5, 10, 20, 50, 100, 200], // Các option lựa chọn số lượng một page table mặc định
  PAGINATION_PAGE_SIZE_LARGE_OPTION: [10, 20, 50, 100, 200, 500, 1000, 2000, 4000], // Các option lựa chọn số lượng một page table lớn
  PAGINATION_TOTAL_VISIABLE: 6,
  PAGINATION_CURRENT_PAGE: 1,
  MAX_ITEM_SELECT_MULT: 3,
  MAX_ITEM_ACTION: 3,
  SIZE_AVATAR_DEFAULT: 40,
  SIZE_ICON_DEFAULT: 16,
  VARIANT_DEFAULT: 'tonal',

  /** File */
  documentExtention: '.doc, .docx, .pptx, .pptm, .ppt, .pdf, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  videoExtention: '.mp4, .mov, .mmv, .avi, .mpeg-2, .flv, .f4v',
  audioExtention: '.mp3,.wav,.3gp,.m4a, .acc',
  excelFileExtention: '.xlsm,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  imageFileExtention: '.jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff',
  videoTypes: ['.mp4', '.mov', '.mmv', '.avi', '.mpeg-2', '.flv', '.f4v'],
  audioTypes: ['.mp3', '.wav', '.wma', '.3gp', '.aa', '.acc', '.aax', '.act', '.aiff', '.alac', '.amr', '.ape', '.au', '.awb', '.dss', '.dvf', '.flac', '.gms', '.m4a', '.m4b', '.mpc', '.webm'],
  imageTypes: ['.tif', '.tiff', '.bmp', '.jpg', '.jpeg', '.gif', '.png', '.eps', '.raw', '.cr2', '.nef', '.orf', '.sr2'],
  otherFileExtention: '.rar, .zip, .txt, .doc, .docx, .pptx, .pptm, .ppt, .pdf, .xls, .xlsm, .xlsx, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

})

export default Globals
