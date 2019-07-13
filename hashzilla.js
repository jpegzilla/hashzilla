// class for hashing with different algorithms. made simply so I could practice cryptography techniques in javascript.

const trunc = (str, len) => {
  while (str.length > len) str = str.slice(1);
  return str;
};

const and = (a, b) => {
  let arra = a.split("").map(x => +x);
  let arrb = b.split("").map(x => +x);
  let xorarr = arra.map((c, i) => c & arrb[i]);
  return xorarr.join("").toString();
};

const or = (a, b) => {
  let arra = a.split("").map(x => +x);
  let arrb = b.split("").map(x => +x);
  let xorarr = arra.map((c, i) => c | arrb[i]);
  return xorarr.join("").toString();
};

const xor = (a, b) => {
  let arra = a.split("").map(x => +x);
  let arrb = b.split("").map(x => +x);
  let xorarr = arra.map((c, i) => c ^ arrb[i]);
  return xorarr.join("").toString();
};

const not = a => {
  let arr = a.split("").map(x => x);
  return arr
    .map(l => {
      return l == "1" ? "0" : "1";
    })
    .join("");
};

const rotleft = (str, num) => {
  if (num > str.length) throw new Error("rotation failed.");
  str = str.toString();
  return str.slice(num) + str.slice(0, num);
};

const padzero = (num, len) => {
  let arr = num.toString().split("");
  if (len <= arr.length) throw new Error("zero padding failed.");
  while (arr.length < len) arr.unshift("0");

  return arr.join("");
};

const binadd = (stra, strb) => {
  const numa = parseInt(stra, 2);
  const numb = parseInt(strb, 2);
  let sum = (numa + numb).toString(2);
  let len = stra.length;

  while (sum.length < stra.length) {
    sum = "0" + sum;
  }

  return sum.length === length ? "1" + sum : sum;
};

const stringsplit = (str, num) => {
  if (str.length % num !== 0) throw new Error("string split failed.");
  let arr = [];
  let prev = 0;

  for (let i = num; i <= str.length; i += num) {
    arr.push(str.slice(prev, i));
    prev = i;
  }
  return arr;
};

const bintohex = str => {
  let dec = parseInt(str, 2);
  return dec.toString(16);
};

String.prototype.hexEncode = function() {
  let hex, i;

  let result = "";
  for (let i = 0; i < this.length; i++) {
    hex = this.charCodeAt(i).toString(16);
    result += ("000" + hex).slice(-4);
  }

  return result;
};

class hashzilla {
  constructor(input) {
    this.input = input;
  }

  sha1() {
    "use strict";

    let h0 = "01100111010001010010001100000001";
    let h1 = "11101111110011011010101110001001";
    let h2 = "10011000101110101101110011111110";
    let h3 = "00010000001100100101010001110110";
    let h4 = "11000011110100101110000111110000";

    const ascii = this.input.split("").map(letter => letter.charCodeAt());
    let bin = ascii.map(n => n.toString(2)).map(n => n.padStart(8, "0"));

    let numstring = bin.join("") + "1";

    while (numstring.length % 512 !== 448) numstring += "0";

    const length = bin.join("").length;
    const binlen = length.toString(2);

    const padbinlen = binlen.padStart(64, "0");

    numstring += padbinlen;
    const chunks = stringsplit(numstring, 512);
    const wordchunks = chunks.map(c => stringsplit(c, 32));

    const allchunks = wordchunks.map(k => {
      for (let i = 16; i <= 79; i++) {
        let wa = k[i - 2];
        let wb = k[i - 4];
        let wc = k[i - 8];
        let wd = k[i - 16];

        let xora = xor(wa, wb);
        let xorb = xor(xora, wc);
        let xorc = xor(xorb, wd);
        k.push(rotleft(xorc, 1));
      }
      return k;
    });

    console.log(allchunks);

    for (let i = 0; i < allchunks.length; i++) {
      let a = h0;
      let b = h1;
      let c = h2;
      let d = h3;
      let e = h4;

      for (let j = 0; j < 80; j++) {
        let f;
        let k;
        if (j < 20) {
          f = or(and(b, c), and(not(b), d));
          k = "01011010100000100111100110011001";
        } else if (j < 40) {
          f = xor(xor(b, c), d);
          k = "01101110110110011110101110100001";
        } else if (j < 60) {
          f = or(or(and(b, c), and(b, d)), and(c, d));
          k = "10001111000110111011110011011100";
        } else {
          f = xor(xor(b, c), d);
          k = "11001010011000101100000111010110";
        }
        let word = allchunks[i][j];
        let tempa = binadd(rotleft(a, 5), f);
        let tempb = binadd(tempa, e);
        let tempc = binadd(tempb, k);
        let temp = binadd(tempc, word);

        temp = trunc(temp, 32);
        e = d;
        d = c;
        c = rotleft(b, 30);
        b = a;
        a = temp;
      }

      h0 = trunc(binadd(h0, a), 32);
      h1 = trunc(binadd(h1, b), 32);
      h2 = trunc(binadd(h2, c), 32);
      h3 = trunc(binadd(h3, d), 32);
      h4 = trunc(binadd(h4, e), 32);
    }

    return [h0, h1, h2, h3, h4].map(string => bintohex(string)).join("");
  }

  bcrypt() {}

  sha256() {}

  jpz() {
    let hashes = [
      "1110000101100001",
      "0110001011110001",
      "1100111101100001",
      "0000101110111101",
      "0100111001010000",
      "0010101110100100",
      "1111011011110011",
      "1111100011100000",
      "1010010110110110",
      "1100100000111111",
      "0111011100100010",
      "0101011011011011",
      "1100010110000110",
      "0101100011100010",
      "0101011010011100",
      "1101011001001011",
      "1101011101010100",
      "1110111101101100",
      "0101001110000011",
      "1000100001101100",
      "1000011100010010",
      "0100011000110100",
      "1101111010011000",
      "1101001111010001",
      "0011011111000001",
      "1111001011100010",
      "1010001000111110",
      "0010000110010100",
      "0000011011001111",
      "1110101110010000",
      "0010111010011010",
      "0011000001101111"
    ];

    let comphashes = [];

    const saltshaker = function(len) {
      let arr = ["*"];
      const chars =
        "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

      for (var i = 0; i < len; i++)
        arr.push(chars[Math.floor(Math.random() * chars.length)]);

      arr.push("*jpz");
      arr = arr.join("").toString();
      return (this.salt = arr);
    };

    const salt = new saltshaker(6);

    const hasher = function(cyclecount, input) {
      let arr = [];

      const makechunks = (arr, size) => {
        let out = [];
        for (let i = 0; i < arr.length; i++) out.push(arr.slice(i, i + size));
        return out;
      };

      const all = input.map(k => {
        for (let i = 16; i <= 63; i++) {
          let wa = k[i - 2];
          let wb = k[i - 4];
          let wc = k[i - 8];
          let wd = k[i - 16];

          let xora = xor(wa, wb);
          let xorb = xor(xora, wc);
          let xorc = xor(xorb, wd);
          k.push(rotleft(xorc, 1));
        }
        return k;
      });

      const added = all.map(c => c.join(""));
      let addedchunks = makechunks(added.join(""), 16);

      for (let i = 0; i < addedchunks.length; i++) {
        addedchunks[i] = addedchunks[i + 1]
          ? Math.abs(parseInt(addedchunks[i] & addedchunks[i + 1])).toString(2)
          : addedchunks[i];
      }

      addedchunks.map(a => {
        if (/^.{16}$/g.test(a)) {
          comphashes.push(a);
        }
      });

      comphashes = comphashes.splice(0, hashes.length);
      console.log(comphashes);

      let cons = [
        hashes[0],
        hashes[1],
        hashes[2],
        hashes[3],
        hashes[4],
        hashes[5],
        hashes[6],
        hashes[7],
        hashes[8],
        hashes[9],
        hashes[10],
        hashes[11],
        hashes[12],
        hashes[13],
        hashes[14],
        hashes[15]
      ];

      for (let d = 0; d < cyclecount; d++) {
        let m, n;
        for (let i = 0; i < hashes.length; i++) {
          if (i < 4) {
            const zerotwo = and(cons[0], cons[2]);
            const notone = and(not(cons[1]), cons[3]);
            m = or(zerotwo, notone);
            n = "00010110";
          } else if (i < 8) {
            const fivexorseven = xor(cons[5], cons[7]);
            m = xor(fivexorseven, cons[3]);
            n = "00111011";
          } else if (i < 16) {
            const fourandsix = and(cons[4], cons[6]);
            const fourandtwo = and(cons[4], cons[2]);
            const threeandfive = and(cons[3], cons[5]);
            const fasorfat = or(fourandsix, fourandtwo);
            m = or(fasorfat, threeandfive);
            n = "01001110";
          } else {
            const zeroxorseven = xor(cons[0], cons[7]);
            m = xor(zeroxorseven, cons[7]);
            n = "10101011";
          }

          const current = comphashes[i];
          const ta = binadd(rotleft(cons[0], 5), cons[5]);
          const tb = binadd(ta, cons[6]);
          const tc = binadd(tb, n);
          const tmp = binadd(tc, current);

          cons[6] = cons[4];
          cons[4] = cons[2];
          cons[2] = rotleft(cons[1], 10);
          cons[1] = cons[0];
          cons[0] = tmp;
        }

        cons[0] = trunc(binadd(hashes[7], cons[0]));
        cons[1] = trunc(binadd(hashes[8], cons[1]));
        cons[2] = trunc(binadd(hashes[9], cons[2]));
        cons[3] = trunc(binadd(hashes[10], cons[3]));
        cons[4] = trunc(binadd(hashes[11], cons[4]));
        cons[5] = trunc(binadd(hashes[12], cons[5]));
        cons[6] = trunc(binadd(hashes[13], cons[6]));
        cons[7] = trunc(binadd(hashes[14], cons[7]));
        cons[8] = trunc(binadd(hashes[0], cons[0]));
        cons[9] = trunc(binadd(hashes[1], cons[1]));
        cons[10] = trunc(binadd(hashes[2], cons[2]));
        cons[11] = trunc(binadd(hashes[3], cons[3]));
        cons[12] = trunc(binadd(hashes[4], cons[4]));
        cons[13] = trunc(binadd(hashes[5], cons[5]));
        cons[14] = trunc(binadd(hashes[6], cons[6]));
        cons[15] = trunc(binadd(hashes[7], cons[7]));
      }

      console.log(cons);

      for (let i = 0; i < cons.length; i++) {
        cons[i] = cons[i].padStart(32, "0");
        cons[i] = bintohex(cons[i]);
      }
      return (this.hashed = cons.join(""));
    };

    const input = this.input;
    const ascii = input.split("").map(a => a.charCodeAt());
    let binary =
      ascii
        .map(a => a.toString(2))
        .map(c => c.padStart(8, "0"))
        .join("") + "1";

    let binaryrev = binary
      .split("")
      .reverse()
      .join("");

    let bin = ascii.map(n => n.toString(2)).map(n => n.padStart(8, "0"));

    for (var i = 0; i < binary.length; i++) {
      if (binary.length % 1024 !== 896) {
        binary += "0";
        binaryrev += "0";
      }
    }

    const paddedbin = binary.padStart(128 - binary.length, "0");
    const paddedbinrev = binaryrev.padStart(128 - binary.length, "0");
    let center = (bin.join("").length.toString(2) << (bin.length / 8))
      .toString(2)
      .padStart(64, "0");

    center = center.repeat(2);

    let newbinary =
      paddedbinrev +
      center +
      paddedbin
        .split("")
        .reverse()
        .join("");

    for (var i = 0; i < newbinary.length; i++) {
      if (newbinary.length % 1024 !== 0) newbinary += "0";
    }

    const chunks = newbinary.match(/.{1,512}/g);
    const wordchunks = chunks.map(c => c.match(/.{1,32}/g));
    const hashresults = new hasher(100, wordchunks);

    return hashresults.hashed + salt.salt;
  }
}

console.log(new hashzilla("weior1").jpz());

// console.log(new hashzilla("world").sha1());
