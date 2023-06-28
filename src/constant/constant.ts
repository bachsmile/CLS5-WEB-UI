const constant = Object.freeze({
  sortCourseDefault: [
    { value: 1, key: '*position', title: 'CourseService_Sort_By_Position_AZ' },
    { value: 2, key: '-position', title: 'CourseService_Sort_By_Position_ZA' },
    { value: 3, key: 'expiring', title: 'CourseService_Expiring' },
    { value: 4, key: '-createdDate', title: 'CourseService_Sort_By_Created_Date' },
    { value: 5, key: '+name', title: 'CourseService_Sort_By_Name_Asc' },
    { value: 6, key: '-name', title: 'CourseService_Sort_By_Name_Desc' },
    { value: 7, key: '-modifiedDate', title: 'CourseService_Sort_By_Updated_Date' },
    { value: 8, key: 'newest_asc', title: 'system-management.newest-course' },
    { value: 9, key: 'newest_desc', title: 'system-management.oldest-course' },
    { value: 10, key: 'register_asc', title: 'system-management.most-register-course' },
    { value: 11, key: 'register_desc', title: 'system-management.least-register-course' },
  ],
  MIN_NUMBER: 0,
  MAX_NUMBER: 10000,
  MAX_LENGTH_TEXT_FIELD: 256,
})
export default constant
