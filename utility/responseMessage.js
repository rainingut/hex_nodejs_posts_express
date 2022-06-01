const responseMessage = {
  postSuccess:         '新增成功',
  postFail:            '新增失敗',
  patchSuccess:        '更新成功',
  patchFail:           '更新失敗',
  deleteSuccess:       '刪除成功',
  deleteFail:          '刪除失敗',
  deleteAllSuccess:    '全部項目刪除成功',
  deleteAllFail:       '全部項目刪除失敗',
  wrongFormat:         '格式錯誤',
  noItem:              '查無此項',
  noPage:              '查無此頁',
  wrongFormatOrNoItem: '格式錯誤或查無此項',
  
  // posts
  titleRequired:       '標題必填',
  contentRequired:     '內容必填',

  // users
  noUser:              '查無使用者',
  noSelf:              '非本人',
  cantSelf:            '不能作自己',
  nameRequired:        '暱稱必填',
  emailRequired:       'Email必填',
  passwordRequired:    '密碼必填',
  passwordWroung:      '密碼驗證錯誤',
  emailFormat:         'Email格式錯誤',
  pswAtLeastSix:       '密碼至少需要六碼',
  accoundAlreadExist:  '該帳號已存在',
  imageNotMatch:       '圖片格式不符',
  sexNotMatch:         '生理性別不是男或女',

  //auth
  noSignIn:            '尚未登入',
  noAdmin:             '權限不足',

  // upload
  imageFormat:         '僅限jpg, png, 或 jpeg',
  nofile:              '尚未上傳',

  // 開大絕
  somethingWrong:      'Something Wrong',

  // 覺得小組這樣的寫法很棒，效仿的～ XD
  // (但是還沒用XD)
  FAIL: {
    status: 1,
    statusCode: 400,
    message: `失敗`
  }
}

module.exports = responseMessage;