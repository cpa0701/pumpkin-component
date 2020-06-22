/**
 * Create by Pengan Chen on 2020/6/19
 */
import SparkMD5 from 'spark-md5'

/**
 * MD5加密文件
 * @param file
 * @param callback
 */
export const md5File = (file, callback) => {
  const fileSize = file.size // 文件大小
  const chunkSize = 1024 * 1024 * 10 // 切片的大小
  const chunks = Math.ceil(fileSize / chunkSize) // 获取切片个数
  const fileReader = new FileReader()
  const spark = new SparkMD5.ArrayBuffer()
  const bolbSlice =
    File.prototype.slice ||
    File.prototype.mozSlice ||
    File.prototype.webkitSlice
  let currentChunk = 0

  fileReader.onload = e => {
    const res = e.target.result
    spark.append(res)
    currentChunk++
    if (currentChunk < chunks) {
      loadNext()
    } else {
      const md5 = spark.end()
      console.log(md5)
      callback(md5)
    }
  }

  const loadNext = () => {
    const start = currentChunk * chunkSize
    const end =
      start + chunkSize > file.size ? file.size : start + chunkSize
    fileReader.readAsArrayBuffer(bolbSlice.call(file, start, end))
  }
  loadNext()
}
