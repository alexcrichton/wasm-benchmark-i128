class TextDecoder {
  constructor(enc) {
    if (enc != "utf-8") {
      throw new Error("FITZGEN: unsupported encoding: " + enc);
    }
  }
  decode(buf) {
    let buf8 = new Uint8Array(buf);
    let s = "";
    for (let i = 0; i < buf8.length; i++) {
      s += String.fromCharCode(buf8[i]); // lol
    }
    return s;
  }
}

class TextEncoder {
  constructor(enc) {
    if (enc && enc != "utf-8") {
      throw new Error("FITZGEN: unsupported encoding: " + enc);
    }
  }
  encode(s, n) {
    const buf = new Uint8Array(s.length * 4);
    let [_read, written] = encodeAsUtf8InBuffer(s, buf);
    return buf.slice(0, written);
  }
}