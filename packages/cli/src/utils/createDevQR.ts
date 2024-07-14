import qrcode from 'qrcode-terminal'

export function createDevQR(url: string) {
  qrcode.generate(url, { small: true }, function (qrcode) {
    console.log(qrcode)
  })
}
