import qrcode from 'qrcode-terminal'

export const printQR = (str: string) => {
  qrcode.generate(str, { small: true }, function (qrcode) {
    console.log(qrcode)
  })
}
