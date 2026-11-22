/* MiniMatlab — tarayıcıda (file://) ve Node'da çalışan, bağımlılıksız MATLAB alt kümesi yorumlayıcısı.
 * Kullanım: const m = new MiniMatlab(); const r = m.run(kod);
 * r = { output, error:null|{message,line,mesajTr}, vars, figures, cleared }
 */
(function (root, factory) {
  'use strict';
  var MM = factory();
  if (typeof module === 'object' && module && module.exports) module.exports = MM;
  if (typeof window !== 'undefined') window.MiniMatlab = MM;
})(this, function () {
  'use strict';

  // ---------------------------------------------------------------- hatalar
  class MError extends Error {
    constructor(message, tr, line) { super(message); this.tr = tr || ''; this.line = line || 0; }
  }
  function E(msg, tr, line) { return new MError(msg, tr, line); }

  const MSG = {
    GENERIC: 'Invalid expression. Check for missing multiplication operator, missing or unbalanced delimiters, or other syntax error. To construct matrices, use brackets instead of parentheses.',
    BRACKET: 'Invalid expression. When calling a function or indexing a variable, use parentheses. Otherwise, check for mismatched delimiters.',
    EQ: "Incorrect use of '=' operator. Assign a value to a variable using '=' and compare values for equality using '=='.",
    MISSING_END: 'At least one END is missing. The statement beginning here does not have a matching end.',
    ILLEGAL_END: 'Illegal use of reserved keyword "end".',
    BADCHAR: 'Invalid text character. Check for unsupported symbol, invisible character, or pasting of non-ASCII characters.',
    BADIDX: 'Array indices must be positive integers or logical values.',
    CAT: 'Dimensions of arrays being concatenated are not consistent.',
    MTIMES: 'Incorrect dimensions for matrix multiplication. Check that the number of columns in the first matrix matches the number of rows in the second matrix. To operate on each element of the matrix individually, use TIMES (.*) for elementwise multiplication.',
    SIZES: 'Arrays have incompatible sizes for this operation.',
    STEPS: 'Operation terminated: the step limit was exceeded (possible infinite loop).'
  };
  const TR = {
    GENERIC: 'Sözdizimi hatası: bu satırda MATLAB\'ın anlayamadığı bir ifade var. Eksik bir operatör (örn. 2x yerine 2*x), kapanmamış parantez/köşeli parantez ya da fazladan bir karakter olabilir.',
    BRACKET: 'MATLAB\'da indeksleme ve fonksiyon çağrısı köşeli parantezle değil normal parantezle yapılır: A[1,2] yerine A(1,2) yaz. Köşeli parantez [ ] yalnızca matris oluşturmak içindir.',
    EQ: 'Tek "=" atama demektir. Karşılaştırma yapmak için çift eşittir "==" kullan (örn. if x == 5). Atama yapıyorsan sol tarafta yalnızca bir değişken adı (ya da A(i,j) gibi bir indeks) olabilir.',
    MISSING_END: 'Bir "end" eksik: buradaki if / for / while bloğu "end" ile kapatılmamış. Her if, for ve while için ayrı bir end yazmalısın (iç içe iki for → iki end).',
    ILLEGAL_END: 'Fazladan bir "end" var ya da "end" yanlış yerde: bu end\'in kapattığı bir if / for / while yok.',
    BADIDX: 'MATLAB\'da indeksler 1\'den başlar. 0, negatif ya da ondalıklı bir indeks kullanılamaz (örn. A(0) hatalıdır, ilk eleman A(1)\'dir).',
    CAT: 'Birleştirilen matrislerin boyutları uyuşmuyor: yan yana (boşluk/virgül) koyduklarının satır sayısı, alt alta (noktalı virgül) koyduklarının sütun sayısı aynı olmalı. Her satıra aynı sayıda eleman yazdığını kontrol et.',
    MTIMES: '"*" matris çarpımıdır: soldaki matrisin sütun sayısı sağdakinin satır sayısına eşit olmalı. Eleman eleman çarpmak istiyorsan ".*" kullan.',
    SIZES: 'Eleman-bazlı işlemde iki tarafın boyutları aynı olmalı (ya da biri skaler olmalı). size(...) ile boyutları kontrol et.',
    STEPS: 'Kod çok uzun süre çalıştı ve durduruldu; büyük olasılıkla sonsuz döngü var. while koşulunun bir gün yanlış (false) olacağından, döngü değişkenini döngü içinde güncellediğinden emin ol.'
  };

  // ---------------------------------------------------------------- değerler
  function Val(cls, dims, data) { this.cls = cls; this.dims = dims; this.data = data; this.owned = false; }
  const COLON = { colon: true };
  const MAXEL = 5e7;

  function num(x) { const d = new Float64Array(1); d[0] = x; return new Val('double', [1, 1], d); }
  function bool(b) { const d = new Float64Array(1); d[0] = b ? 1 : 0; return new Val('logical', [1, 1], d); }
  function str(s) {
    const d = new Float64Array(s.length);
    for (let i = 0; i < s.length; i++) d[i] = s.charCodeAt(i);
    return new Val('char', s.length ? [1, s.length] : [0, 0], d);
  }
  function empty() { return new Val('double', [0, 0], new Float64Array(0)); }
  function rowVec(arr) { return new Val('double', [1, arr.length], Float64Array.from(arr)); }
  function clone(v) { return new Val(v.cls, v.dims.slice(), v.data.slice()); }
  function alloc(n) {
    if (!(n <= MAXEL)) throw E('Requested array exceeds the maximum array size preference.', 'İstenen matris çok büyük; bu çalışma ortamında bu kadar büyük bir dizi oluşturulamaz. Boyutları kontrol et.');
    return new Float64Array(n);
  }
  function prod(d) { let p = 1; for (let i = 0; i < d.length; i++) p *= d[i]; return p; }
  function sameDims(a, b) { if (a.length !== b.length) return false; for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false; return true; }
  function normDims(d) { d = d.slice(); while (d.length > 2 && d[d.length - 1] === 1) d.pop(); return d; }
  function isRow(v) { return v.dims.length === 2 && v.dims[0] === 1; }
  function charStr(v) { let s = ''; const d = v.data; for (let i = 0; i < d.length; i++) s += String.fromCharCode(d[i]); return s; }
  function dimStr(d, sep) { return d.join(sep || '×'); }
  function sat8(x) { return x !== x ? 0 : x <= 0 ? 0 : x >= 255 ? 255 : Math.floor(x + 0.5); }
  function mround(x) { return x < 0 ? -Math.floor(-x + 0.5) : Math.floor(x + 0.5); }
  function toCls(v, cls) {
    if (v.cls === cls) return v;
    const n = v.data.length, o = new Float64Array(n), d = v.data;
    if (cls === 'uint8') for (let i = 0; i < n; i++) o[i] = sat8(d[i]);
    else if (cls === 'logical') {
      for (let i = 0; i < n; i++) {
        if (d[i] !== d[i]) throw E('NaN values cannot be converted to logicals.', 'NaN değeri mantıksal (logical) değere çevrilemez.');
        o[i] = d[i] !== 0 ? 1 : 0;
      }
    } else o.set(d);
    return new Val(cls, v.dims.slice(), o);
  }
  function truthy(v) {
    const d = v.data, n = d.length;
    if (n === 0) return false;
    for (let i = 0; i < n; i++) if (d[i] === 0) return false;
    return true;
  }

  // ---------------------------------------------------------------- tokenizer
  const KEYWORDS = new Set(['if', 'elseif', 'else', 'end', 'for', 'while', 'break', 'continue', 'return', 'function', 'switch', 'case', 'otherwise', 'try', 'catch', 'global', 'persistent', 'parfor']);
  const OPS2 = ['==', '~=', '<=', '>=', '&&', '||', '.*', './', '.^', ".'", '.\\'];
  const OPS1 = "+-*/^\\'()[]{},;:=<>&|~.@";

  function tokenize(src) {
    const toks = [];
    const n = src.length;
    let i = 0, line = 1, sp = false;
    const stack = [];
    function push(t, v) { toks.push({ t: t, v: v, line: line, sp: sp }); sp = false; }
    while (i < n) {
      const ch = src[i];
      if (ch === ' ' || ch === '\t' || ch === '\r' || ch === ' ') { i++; sp = true; continue; }
      if (ch === '.' && src.startsWith('...', i)) {
        while (i < n && src[i] !== '\n') i++;
        if (i < n) { i++; line++; }
        sp = true; continue;
      }
      if (ch === '%') { while (i < n && src[i] !== '\n') i++; continue; }
      if (ch === '\n') {
        push('nl');
        line++; i++;
        if (stack.length && stack[stack.length - 1] !== '[') stack.length = 0;
        continue;
      }
      const cc = src.charCodeAt(i);
      const isDigit = cc >= 48 && cc <= 57;
      if (isDigit || (ch === '.' && i + 1 < n && src.charCodeAt(i + 1) >= 48 && src.charCodeAt(i + 1) <= 57)) {
        let j = i;
        while (j < n && src.charCodeAt(j) >= 48 && src.charCodeAt(j) <= 57) j++;
        if (src[j] === '.' && "*/^\\'".indexOf(src[j + 1] || ' ') < 0 && !src.startsWith('...', j)) {
          j++;
          while (j < n && src.charCodeAt(j) >= 48 && src.charCodeAt(j) <= 57) j++;
        }
        if ((src[j] === 'e' || src[j] === 'E')) {
          let k = j + 1;
          if (src[k] === '+' || src[k] === '-') k++;
          if (src.charCodeAt(k) >= 48 && src.charCodeAt(k) <= 57) {
            while (k < n && src.charCodeAt(k) >= 48 && src.charCodeAt(k) <= 57) k++;
            j = k;
          }
        }
        push('num', parseFloat(src.slice(i, j)));
        i = j; continue;
      }
      if ((cc >= 65 && cc <= 90) || (cc >= 97 && cc <= 122) || ch === '_') {
        let j = i + 1;
        for (; j < n; j++) {
          const c = src.charCodeAt(j);
          if (!((c >= 65 && c <= 90) || (c >= 97 && c <= 122) || (c >= 48 && c <= 57) || c === 95)) break;
        }
        const w = src.slice(i, j);
        if (j < n && src.charCodeAt(j) > 127 && /[A-Za-zÀ-ɏ]/.test(src[j])) {
          let k = j; while (k < n && /[A-Za-z0-9_À-ɏ]/.test(src[k])) k++;
          throw E(MSG.BADCHAR, 'Değişken ve fonksiyon adlarında Türkçe karakter (ç, ğ, ı, İ, ö, ş, ü) kullanılamaz: "' + src.slice(i, k) + '" geçersiz. Yalnızca İngilizce harf, rakam ve alt çizgi kullan (örn. "' + asciiName(src.slice(i, k)) + '").', line);
        }
        push(KEYWORDS.has(w) ? 'kw' : 'id', w);
        i = j; continue;
      }
      if (ch === "'" || ch === '"') {
        let transpose = false;
        if (ch === "'") {
          const p = toks[toks.length - 1];
          const valueEnd = p && (p.t === 'num' || p.t === 'id' || p.t === 'str' || (p.t === 'kw' && p.v === 'end') ||
            (p.t === 'op' && (p.v === ')' || p.v === ']' || p.v === '}' || p.v === "'" || p.v === ".'")));
          const inBr = stack.length && stack[stack.length - 1] === '[';
          transpose = !!valueEnd && !(sp && inBr);
        }
        if (transpose) { push('op', "'"); i++; continue; }
        let j = i + 1, s = '';
        for (;;) {
          if (j >= n || src[j] === '\n') {
            throw E(ch === "'" ? 'Character vector is not terminated properly.' : 'String is not terminated properly.',
              'Metin (tırnak içi yazı) kapatılmamış: açtığın ' + ch + ' işaretini satır bitmeden yine ' + ch + ' ile kapatmalısın.', line);
          }
          if (src[j] === ch) {
            if (src[j + 1] === ch) { s += ch; j += 2; continue; }
            break;
          }
          s += src[j]; j++;
        }
        push('str', s);
        i = j + 1; continue;
      }
      if (ch === '!') {
        throw E('Invalid use of operator.', 'MATLAB\'da "!" işareti kullanılmaz. "Eşit değil" için ~= , "değil" için ~ yazılır (örn. a ~= b).', line);
      }
      const two = src.substr(i, 2);
      if (OPS2.indexOf(two) >= 0) { push('op', two); i += 2; continue; }
      if (OPS1.indexOf(ch) >= 0) {
        if (ch === '(' || ch === '[' || ch === '{') stack.push(ch);
        else if (ch === ')' || ch === ']' || ch === '}') stack.pop();
        push('op', ch); i++; continue;
      }
      if (cc > 127 && /[A-Za-zÀ-ɏ]/.test(ch)) {
        let k = i; while (k < n && /[A-Za-z0-9_À-ɏ]/.test(src[k])) k++;
        throw E(MSG.BADCHAR, 'Değişken ve fonksiyon adlarında Türkçe karakter (ç, ğ, ı, İ, ö, ş, ü) kullanılamaz: "' + src.slice(i, k) + '" geçersiz. Yalnızca İngilizce harf, rakam ve alt çizgi kullan (örn. "' + asciiName(src.slice(i, k)) + '").', line);
      }
      throw E(MSG.BADCHAR, 'Kodda MATLAB\'ın tanımadığı bir karakter var: "' + ch + '". Kopyala-yapıştır sırasında gelen özel bir işaret (örn. kıvrık tırnak “ ” ya da ×) olabilir; silip klavyeden yeniden yaz.', line);
    }
    push('nl');
    push('eof');
    return toks;
  }
  function asciiName(s) {
    const map = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u', 'Ç': 'C', 'Ğ': 'G', 'İ': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U' };
    return s.replace(/[^A-Za-z0-9_]/g, function (c) { return map[c] || '_'; });
  }

  // ---------------------------------------------------------------- parser
  const CMDS = new Set(['clc', 'clear', 'clearvars', 'close', 'hold', 'format', 'axis', 'grid', 'colormap', 'figure']);
  const BINLEVELS = [['||'], ['&&'], ['|'], ['&'], ['==', '~=', '<', '<=', '>', '>=']];

  class Parser {
    constructor(toks) { this.t = toks; this.p = 0; this.inMat = false; this.inIdx = 0; this.endCount = 0; }
    peek() { return this.t[this.p]; }
    next() { return this.t[this.p++]; }
    isOp(v) { const k = this.t[this.p]; return k.t === 'op' && k.v === v; }
    isKw(v) { const k = this.t[this.p]; return k.t === 'kw' && k.v === v; }
    isTerm() { const k = this.t[this.p]; return k.t === 'nl' || k.t === 'eof' || (k.t === 'op' && (k.v === ';' || k.v === ',')); }
    unexpected(k) {
      k = k || this.peek();
      if (k.t === 'op' && k.v === '[') {
        const p = this.t[this.p - 1];
        if (p && (p.t === 'id' || (p.t === 'op' && p.v === ')'))) return E(MSG.BRACKET, TR.BRACKET, k.line);
      }
      if (k.t === 'op' && (k.v === '{' || k.v === '}')) return E('Cell arrays (braces {}) are not supported in this environment.', 'Süslü parantez { } (cell dizileri) bu çalışma ortamında desteklenmiyor. İndeksleme için ( ), matris için [ ] kullan.', k.line);
      if (k.t === 'op' && k.v === '=') return E(MSG.EQ, TR.EQ, k.line);
      if (k.t === 'kw' && k.v === 'end') return E(MSG.ILLEGAL_END, TR.ILLEGAL_END, k.line);
      if (k.t === 'nl' || k.t === 'eof') {
        const pl = this.p > 0 ? this.t[this.p - 1].line : k.line;
        return E('Invalid expression. Check for missing or extra characters.', 'İfade yarım kalmış: satırın sonunda bir değer, kapanış parantezi ya da köşeli parantez eksik.', k.t === 'eof' ? pl : k.line);
      }
      if (k.t === 'op' && (k.v === ')' || k.v === ']')) return E(MSG.BRACKET, 'Parantezler eşleşmiyor: fazladan ya da yanlış türde bir kapanış "' + k.v + '" var. Açılan her ( için bir ), her [ için bir ] olmalı.', k.line);
      return E(MSG.GENERIC, TR.GENERIC, k.line);
    }
    expectOp(v) {
      if (!this.isOp(v)) {
        const k = this.peek();
        if ((v === ')' || v === ']') && (k.t === 'nl' || k.t === 'eof' || (k.t === 'op' && k.v === ';'))) {
          throw E(MSG.BRACKET, 'Parantez kapatılmamış: açılan her ( için bir ), her [ için bir ] olmalı.', this.t[Math.max(0, this.p - 1)].line);
        }
        throw this.unexpected();
      }
      return this.next();
    }
    skipSeps() {
      for (;;) {
        const k = this.t[this.p];
        if (k.t === 'nl' || (k.t === 'op' && (k.v === ';' || k.v === ','))) this.p++; else break;
      }
    }
    parseBlock(opener) {
      const stmts = [];
      for (;;) {
        this.skipSeps();
        const k = this.peek();
        if (k.t === 'eof') {
          if (opener) throw E(MSG.MISSING_END, TR.MISSING_END, opener.line);
          return stmts;
        }
        if (k.t === 'kw' && (k.v === 'end' || k.v === 'else' || k.v === 'elseif')) {
          if (!opener) {
            if (k.v === 'end') throw E(MSG.ILLEGAL_END, TR.ILLEGAL_END, k.line);
            throw E('Illegal use of reserved keyword "' + k.v + '".', '"' + k.v + '" yalnızca bir if bloğunun içinde (if ... end arasında) kullanılabilir. Önünde bir if olduğundan ve o if\'in erken "end" ile kapanmadığından emin ol.', k.line);
          }
          return stmts;
        }
        stmts.push(this.parseStatement());
      }
    }
    endStmt() {
      const k = this.peek();
      if (k.t === 'op' && k.v === ';') { this.p++; return true; }
      if (k.t === 'op' && k.v === ',') { this.p++; return false; }
      if (k.t === 'nl') { this.p++; return false; }
      if (k.t === 'eof') return false;
      if (k.t === 'kw' && (k.v === 'end' || k.v === 'else' || k.v === 'elseif')) return false;
      throw this.unexpected();
    }
    parseCond(word) {
      const k = this.peek();
      if (this.isTerm()) {
        if (word === 'elseif') throw E('Invalid expression. An ELSEIF statement requires a condition.', '"elseif" mutlaka bir koşul ister (örn. elseif x > 5). Koşul yazmayacaksan "else" kullan.', k.line);
        throw E('Invalid expression. An ' + word.toUpperCase() + ' statement requires a condition.', '"' + word + '" sözcüğünden sonra bir koşul yazmalısın (örn. ' + word + ' x > 5).', k.line);
      }
      const e = this.parseExpr();
      if (this.isOp('=')) throw E(MSG.EQ, 'Koşul içinde tek "=" kullanılamaz; tek = atamadır. Karşılaştırma için "==" yaz (örn. ' + word + ' x == 5).', this.peek().line);
      return e;
    }
    parseStatement() {
      const k = this.peek(), line = k.line;
      if (k.t === 'kw') {
        switch (k.v) {
          case 'if': {
            this.next();
            const clauses = [{ cond: this.parseCond('if'), line: line, body: null }];
            clauses[0].body = this.parseBlock(k);
            let elseBody = null;
            for (;;) {
              const t = this.next();
              if (t.v === 'elseif') {
                if (elseBody) throw E('Illegal use of reserved keyword "elseif".', '"elseif", "else"den sonra gelemez. Sıra: if → elseif → else → end.', t.line);
                const c = { cond: this.parseCond('elseif'), line: t.line, body: null };
                c.body = this.parseBlock(k);
                clauses.push(c);
              } else if (t.v === 'else') {
                if (elseBody) throw E('Illegal use of reserved keyword "else".', 'Bir if bloğunda yalnızca bir tane "else" olabilir.', t.line);
                elseBody = this.parseBlock(k);
              } else break; // end
            }
            return { type: 'If', clauses: clauses, elseBody: elseBody, line: line };
          }
          case 'for': {
            this.next();
            const paren = this.isOp('(');
            if (paren) this.next();
            const id = this.peek();
            if (id.t !== 'id') throw E('Invalid expression. A FOR statement requires a loop variable.', 'for döngüsü "for i = 1:10" biçiminde yazılır: for, değişken adı, =, aralık.', id.line);
            this.next();
            if (!this.isOp('=')) throw E('Invalid expression. A FOR statement requires "=" after the loop variable.', 'for döngüsü "for i = 1:10" biçiminde yazılır; değişken adından sonra "=" gelmeli.', this.peek().line);
            this.next();
            const e = this.parseExpr();
            if (paren) this.expectOp(')');
            const body = this.parseBlock(k);
            this.next();
            return { type: 'For', name: id.v, e: e, body: body, line: line };
          }
          case 'while': {
            this.next();
            const cond = this.parseCond('while');
            const body = this.parseBlock(k);
            this.next();
            return { type: 'While', cond: cond, body: body, line: line };
          }
          case 'break': case 'continue': case 'return': {
            this.next();
            this.endStmt();
            return { type: k.v === 'break' ? 'Break' : k.v === 'continue' ? 'Continue' : 'Return', line: line };
          }
          case 'end': throw E(MSG.ILLEGAL_END, TR.ILLEGAL_END, line);
          default:
            throw E('The "' + k.v + '" keyword is not supported in this environment.', '"' + k.v + '" bu çalışma ortamında desteklenmiyor. Burada if / elseif / else, for, while, break ve continue kullanabilirsin.', line);
        }
      }
      // komut sözdizimi: clear all, close all, hold on ...
      if (k.t === 'id' && CMDS.has(k.v)) {
        const a = this.t[this.p + 1], b = this.t[this.p + 2];
        if (a.t === 'id' && a.sp && !(b.t === 'op' && (b.v === '=' || b.v === '('))) {
          this.next();
          const args = [];
          while (this.peek().t === 'id' || this.peek().t === 'num') args.push(String(this.next().v));
          const sup = this.endStmt();
          return { type: 'Cmd', name: k.v, args: args, line: line, sup: sup };
        }
      }
      // [a,b] = f(...)
      if (k.t === 'op' && k.v === '[') {
        let depth = 0, q = this.p, found = -1;
        for (; ; q++) {
          const t = this.t[q];
          if (t.t === 'nl' || t.t === 'eof') break;
          if (t.t === 'op' && (t.v === '[' || t.v === '(')) depth++;
          else if (t.t === 'op' && (t.v === ']' || t.v === ')')) { depth--; if (depth === 0) { found = q; break; } }
        }
        if (found >= 0 && this.t[found + 1].t === 'op' && this.t[found + 1].v === '=') {
          this.next();
          const targets = [];
          while (!this.isOp(']')) {
            if (this.isOp(',')) { this.next(); continue; }
            if (this.isOp('~')) { this.next(); targets.push(null); continue; }
            const id = this.peek();
            if (id.t !== 'id') throw E(MSG.EQ, 'Çoklu atamada köşeli parantez içinde yalnızca değişken adları olabilir: [w, h] = size(A) gibi.', id.line);
            this.next();
            let args = null, endFlags = null;
            if (this.isOp('(') && !this.peek().sp) { this.next(); const r = this.parseArgs(); args = r.args; endFlags = r.endFlags; }
            targets.push({ name: id.v, args: args, endFlags: endFlags });
          }
          this.next(); this.next();
          const rhs = this.parseExpr();
          const sup = this.endStmt();
          return { type: 'Multi', targets: targets, rhs: rhs, line: line, sup: sup };
        }
      }
      const e = this.parseExpr();
      if (this.isOp('=')) {
        const eq = this.next();
        if (!(e.type === 'Ident' || e.type === 'Index')) throw E(MSG.EQ, TR.EQ, eq.line);
        if (this.isTerm()) throw E('Invalid expression. Check for missing or extra characters.', '"=" işaretinden sonra atanacak değer yazılmamış (örn. x = 5).', eq.line);
        const rhs = this.parseExpr();
        if (this.isOp('=')) throw E(MSG.EQ, TR.EQ, this.peek().line);
        const sup = this.endStmt();
        return { type: 'Assign', target: e, rhs: rhs, line: line, sup: sup };
      }
      const sup = this.endStmt();
      return { type: 'Expr', e: e, line: line, sup: sup };
    }
    parseExpr() { return this.parseBin(0); }
    parseBin(level) {
      if (level >= BINLEVELS.length) return this.parseRange();
      const ops = BINLEVELS[level];
      let l = this.parseBin(level + 1);
      for (;;) {
        const k = this.peek();
        if (k.t === 'op' && ops.indexOf(k.v) >= 0) {
          this.next();
          const r = this.parseBin(level + 1);
          l = { type: 'Bin', op: k.v, l: l, r: r, line: k.line };
        } else return l;
      }
    }
    parseRange() {
      const a = this.parseAdd();
      if (this.isOp(':')) {
        const nx = this.t[this.p + 1];
        if (nx.t === 'op' && (nx.v === ')' || nx.v === ',')) return a;
        const line = this.next().line;
        const b = this.parseAdd();
        if (this.isOp(':')) {
          this.next();
          const c = this.parseAdd();
          return { type: 'Range', a: a, s: b, b: c, line: line };
        }
        return { type: 'Range', a: a, s: null, b: b, line: line };
      }
      return a;
    }
    parseAdd() {
      let l = this.parseMul();
      for (;;) {
        const k = this.peek();
        if (k.t === 'op' && (k.v === '+' || k.v === '-')) {
          if (this.inMat && k.sp && !this.t[this.p + 1].sp) return l;
          this.next();
          const r = this.parseMul();
          l = { type: 'Bin', op: k.v, l: l, r: r, line: k.line };
        } else return l;
      }
    }
    parseMul() {
      let l = this.parseUnary();
      for (;;) {
        const k = this.peek();
        if (k.t === 'op' && (k.v === '*' || k.v === '/' || k.v === '.*' || k.v === './' || k.v === '\\' || k.v === '.\\')) {
          this.next();
          const r = this.parseUnary();
          l = { type: 'Bin', op: k.v, l: l, r: r, line: k.line };
        } else return l;
      }
    }
    parseUnary() {
      const k = this.peek();
      if (k.t === 'op' && (k.v === '-' || k.v === '+' || k.v === '~')) {
        this.next();
        return { type: 'Un', op: k.v, e: this.parseUnary(), line: k.line };
      }
      return this.parsePower();
    }
    parsePowOperand() {
      const k = this.peek();
      if (k.t === 'op' && (k.v === '-' || k.v === '+' || k.v === '~')) {
        this.next();
        return { type: 'Un', op: k.v, e: this.parsePowOperand(), line: k.line };
      }
      return this.parsePostfix();
    }
    parsePower() {
      let b = this.parsePostfix();
      for (;;) {
        const k = this.peek();
        if (k.t === 'op' && (k.v === '^' || k.v === '.^')) {
          this.next();
          b = { type: 'Bin', op: k.v, l: b, r: this.parsePowOperand(), line: k.line };
        } else return b;
      }
    }
    parsePostfix() {
      let e = this.parsePrimary();
      for (;;) {
        const k = this.peek();
        if (k.t !== 'op') return e;
        if (k.v === '(') {
          if (this.inMat && k.sp) return e;
          if (e.type !== 'Ident') {
            if (k.sp) return e;
            throw E("Indexing with parentheses '()' must appear as the last operation of a valid indexing expression.", 'Bir işlemin ya da başka bir indekslemenin sonucuna doğrudan ( ) ile indeks verilemez. Önce sonucu bir değişkene ata, sonra o değişkeni indeksle.', k.line);
          }
          this.next();
          const r = this.parseArgs();
          e = { type: 'Index', name: e.name, args: r.args, endFlags: r.endFlags, line: e.line };
        } else if (k.v === "'" || k.v === ".'") {
          this.next();
          e = { type: 'Un', op: "'", e: e, line: k.line };
        } else if (k.v === '[' && !k.sp && !this.inMat && (e.type === 'Ident' || e.type === 'Index')) {
          throw E(MSG.BRACKET, TR.BRACKET, k.line);
        } else if (k.v === '{') {
          throw this.unexpected(k);
        } else if (k.v === '.' && !this.inMat) {
          throw E('Dot indexing (structs/objects) is not supported in this environment.', 'Nokta ile alan erişimi (yapı/struct) bu ortamda desteklenmiyor. Eleman-bazlı işlem istiyorsan .* ./ .^ yaz; ondalık sayıda nokta rakamlara bitişik olmalı (örn. 0.5).', k.line);
        } else return e;
      }
    }
    parseArgs() {
      const sm = this.inMat; this.inMat = false; this.inIdx++;
      const args = [], endFlags = [];
      let anyEnd = false;
      if (this.isOp(')')) { this.next(); }
      else {
        for (;;) {
          const nx = this.t[this.p + 1];
          if (this.isOp(':') && nx.t === 'op' && (nx.v === ')' || nx.v === ',')) {
            args.push({ type: 'Colon', line: this.next().line }); endFlags.push(false);
          } else {
            const ec = this.endCount;
            args.push(this.parseExpr());
            const f = this.endCount !== ec; endFlags.push(f); if (f) anyEnd = true;
          }
          if (this.isOp(',')) { this.next(); continue; }
          this.expectOp(')');
          break;
        }
      }
      this.inMat = sm; this.inIdx--;
      return { args: args, endFlags: anyEnd ? endFlags : null };
    }
    parsePrimary() {
      const k = this.peek();
      if (k.t === 'num') { this.next(); const v = num(k.v); v.owned = true; return { type: 'Num', val: v, line: k.line }; }
      if (k.t === 'str') { this.next(); const v = str(k.v); v.owned = true; return { type: 'Str', val: v, line: k.line }; }
      if (k.t === 'id') { this.next(); return { type: 'Ident', name: k.v, line: k.line }; }
      if (k.t === 'kw' && k.v === 'end' && this.inIdx > 0) { this.next(); this.endCount++; return { type: 'End', line: k.line }; }
      if (k.t === 'op') {
        if (k.v === '(') {
          this.next();
          const sm = this.inMat; this.inMat = false;
          const e = this.parseExpr();
          this.expectOp(')');
          this.inMat = sm;
          return { type: 'Paren', e: e, line: k.line };
        }
        if (k.v === '[') return this.parseMatrix();
        if (k.v === ':') throw E(MSG.GENERIC, '":" burada tek başına kullanılamaz. Aralık için iki yanına sayı yaz (1:5); "tümü" anlamı yalnızca indeks içinde geçerlidir: A(:,1).', k.line);
      }
      if (k.t === 'kw' && k.v !== 'end') throw E('Illegal use of reserved keyword "' + k.v + '".', '"' + k.v + '" MATLAB\'ın ayrılmış sözcüğüdür; bir ifadenin ortasında ya da değişken adı olarak kullanılamaz. Önceki satırın/ifadenin tamamlandığını kontrol et.', k.line);
      throw this.unexpected(k);
    }
    parseMatrix() {
      const open = this.next();
      const sm = this.inMat; this.inMat = true;
      const rows = []; let cur = [];
      for (;;) {
        const k = this.peek();
        if (k.t === 'eof') throw E(MSG.BRACKET, 'Köşeli parantez kapatılmamış: "[" ile açılan matris "]" ile bitmeli.', open.line);
        if (k.t === 'op' && k.v === ']') { this.next(); break; }
        if (k.t === 'nl' || (k.t === 'op' && k.v === ';')) { this.next(); if (cur.length) { rows.push(cur); cur = []; } continue; }
        if (k.t === 'op' && k.v === ',') { this.next(); continue; }
        if (k.t === 'op' && k.v === ')') throw E(MSG.BRACKET, 'Parantezler eşleşmiyor: "[" ile açılan matris ")" ile değil "]" ile kapanmalı.', k.line);
        cur.push(this.parseExpr());
      }
      if (cur.length) rows.push(cur);
      this.inMat = sm;
      return { type: 'Mat', rows: rows, line: open.line };
    }
  }
  function parse(src) {
    const p = new Parser(tokenize(src));
    return p.parseBlock(null);
  }

  // ---------------------------------------------------------------- eleman-bazlı işlemler
  function complexErr() {
    return E('Complex results are not supported in this environment.', 'Bu işlem karmaşık (sanal) sayı üretir (örn. negatif sayının karekökü); bu çalışma ortamı karmaşık sayıları desteklemiyor.');
  }
  function pw(x, y) { if (x < 0 && y !== Math.floor(y) && y === y && isFinite(y)) throw complexErr(); return Math.pow(x, y); }
  const OPF = {
    '+': function (x, y) { return x + y; },
    '-': function (x, y) { return x - y; },
    '.*': function (x, y) { return x * y; },
    './': function (x, y) { return x / y; },
    '.^': pw,
    '==': function (x, y) { return x === y ? 1 : 0; },
    '~=': function (x, y) { return x !== y ? 1 : 0; },
    '<': function (x, y) { return x < y ? 1 : 0; },
    '<=': function (x, y) { return x <= y ? 1 : 0; },
    '>': function (x, y) { return x > y ? 1 : 0; },
    '>=': function (x, y) { return x >= y ? 1 : 0; },
    '&': function (x, y) { return (x !== 0 && y !== 0) ? 1 : 0; },
    '|': function (x, y) { return (x !== 0 || y !== 0) ? 1 : 0; }
  };
  const LOGICAL_OPS = { '==': 1, '~=': 1, '<': 1, '<=': 1, '>': 1, '>=': 1, '&': 1, '|': 1 };

  function bsx(a, b, fn, outCls) {
    const ad = a.data, bd = b.data, na = ad.length, nb = bd.length;
    let out, dims;
    if (na === 1 && nb === 1) { out = new Float64Array(1); out[0] = fn(ad[0], bd[0]); dims = [1, 1]; }
    else if (nb === 1) { const y = bd[0]; out = new Float64Array(na); for (let i = 0; i < na; i++) out[i] = fn(ad[i], y); dims = a.dims.slice(); }
    else if (na === 1) { const x = ad[0]; out = new Float64Array(nb); for (let i = 0; i < nb; i++) out[i] = fn(x, bd[i]); dims = b.dims.slice(); }
    else if (sameDims(a.dims, b.dims)) { out = new Float64Array(na); for (let i = 0; i < na; i++) out[i] = fn(ad[i], bd[i]); dims = a.dims.slice(); }
    else {
      const nd = Math.max(a.dims.length, b.dims.length);
      const da = [], db = []; dims = [];
      for (let i = 0; i < nd; i++) {
        const x = i < a.dims.length ? a.dims[i] : 1, y = i < b.dims.length ? b.dims[i] : 1;
        if (x !== y && x !== 1 && y !== 1) {
          throw E(MSG.SIZES, TR.SIZES + ' Burada sol taraf ' + dimStr(a.dims) + ', sağ taraf ' + dimStr(b.dims) + ' boyutunda.');
        }
        da.push(x); db.push(y); dims.push(x === 1 ? y : x);
      }
      const n = prod(dims);
      out = alloc(n);
      const sub = new Array(nd).fill(0);
      for (let p = 0; p < n; p++) {
        let ia = 0, ib = 0, sa = 1, sb = 1;
        for (let k = 0; k < nd; k++) {
          if (da[k] !== 1) ia += sub[k] * sa;
          if (db[k] !== 1) ib += sub[k] * sb;
          sa *= da[k]; sb *= db[k];
        }
        out[p] = fn(ad[ia], bd[ib]);
        for (let k = 0; k < nd; k++) { if (++sub[k] < dims[k]) break; sub[k] = 0; }
      }
    }
    if (outCls === 'uint8') for (let i = 0; i < out.length; i++) out[i] = sat8(out[i]);
    return new Val(outCls, dims, out);
  }
  function arithCls(a, b) { return (a.cls === 'uint8' || b.cls === 'uint8') ? 'uint8' : 'double'; }

  function matmul(a, b) {
    if (a.dims.length > 2 || b.dims.length > 2) throw E('Arguments must be 2-D, or at least one argument must be scalar. Use TIMES (.*) for elementwise multiplication.', '"*" ile matris çarpımı yalnızca 2 boyutlu matrislerde yapılır. Eleman-bazlı çarpım için ".*" kullan.');
    const r = a.dims[0], n = a.dims[1], c = b.dims[1];
    if (n !== b.dims[0]) throw E(MSG.MTIMES, TR.MTIMES + ' Burada sol matris ' + dimStr(a.dims) + ', sağ matris ' + dimStr(b.dims) + ' boyutunda.');
    if (a.cls === 'uint8' || b.cls === 'uint8') throw E('MTIMES (*) is not fully supported for integer classes. At least one argument must be scalar.', 'uint8 matrislerde "*" (matris çarpımı) yapılamaz; en az bir taraf skaler olmalı. Eleman-bazlı çarpım için ".*" kullan ya da önce double(...) ile çevir.');
    const out = alloc(r * c), ad = a.data, bd = b.data;
    for (let j = 0; j < c; j++) {
      for (let k = 0; k < n; k++) {
        const y = bd[k + j * n];
        if (y === 0) continue;
        const ao = k * r, oo = j * r;
        for (let i = 0; i < r; i++) out[oo + i] += ad[ao + i] * y;
      }
    }
    return new Val('double', [r, c], out);
  }
  function binop(op, a, b) {
    switch (op) {
      case '*':
        if (a.data.length === 1 || b.data.length === 1) return bsx(a, b, OPF['.*'], arithCls(a, b));
        return matmul(a, b);
      case '/':
        if (b.data.length === 1) return bsx(a, b, OPF['./'], arithCls(a, b));
        throw E('Matrix right division (/) with a non-scalar divisor is not supported in this environment. Use ./ for elementwise division.', '"/" işaretinin sağında matris varsa bu matris bölmesidir ve burada desteklenmez. Eleman eleman bölmek için "./" kullan.');
      case '^': {
        if (a.data.length === 1 && b.data.length === 1) return bsx(a, b, pw, arithCls(a, b));
        const p = b.data.length === 1 ? b.data[0] : NaN;
        if (a.dims.length === 2 && a.dims[0] === a.dims[1] && p >= 0 && p === Math.floor(p)) {
          const n = a.dims[0];
          let res = new Val('double', [n, n], new Float64Array(n * n));
          for (let i = 0; i < n; i++) res.data[i + i * n] = 1;
          for (let i = 0; i < p; i++) res = matmul(res, a);
          return res;
        }
        throw E('Incorrect dimensions for raising a matrix to a power. Check that the matrix is square and the power is a scalar. To operate on each element of the matrix individually, use POWER (.^) for elementwise power.', '"^" matris üssüdür (yalnızca kare matris ve skaler üs). Her elemanın üssünü almak için ".^" kullan (örn. A.^2).');
      }
      case '\\': case '.\\':
        throw E('Left division (\\) is not supported in this environment.', 'Ters bölü "\\" (soldan bölme) bu ortamda desteklenmiyor. Bölme için "/" ya da "./" kullan.');
    }
    const fn = OPF[op];
    return bsx(a, b, fn, LOGICAL_OPS[op] ? 'logical' : arithCls(a, b));
  }
  function unop(op, v) {
    const d = v.data, n = d.length;
    if (op === "'") {
      if (v.dims.length > 2) throw E('TRANSPOSE does not support N-D arrays.', 'Devrik (\') yalnızca 2 boyutlu matrislerde alınabilir.');
      const r = v.dims[0], c = v.dims[1], o = new Float64Array(n);
      for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) o[j + i * c] = d[i + j * r];
      return new Val(v.cls, [c, r], o);
    }
    const o = new Float64Array(n);
    if (op === '-') {
      if (v.cls === 'uint8') return new Val('uint8', v.dims.slice(), o);
      for (let i = 0; i < n; i++) o[i] = -d[i];
      return new Val('double', v.dims.slice(), o);
    }
    if (op === '~') {
      for (let i = 0; i < n; i++) o[i] = d[i] === 0 ? 1 : 0;
      return new Val('logical', v.dims.slice(), o);
    }
    o.set(d);
    return new Val(v.cls === 'uint8' ? 'uint8' : 'double', v.dims.slice(), o);
  }
  function rangeVal(a, s, b) {
    if (!(s !== 0) || s !== s || a !== a || b !== b || (s > 0 && a > b) || (s < 0 && a < b)) return new Val('double', [1, 0], new Float64Array(0));
    const n = Math.floor((b - a) / s + 1e-10) + 1;
    const o = alloc(n);
    for (let i = 0; i < n; i++) o[i] = a + i * s;
    return new Val('double', [1, n], o);
  }

  // ---------------------------------------------------------------- birleştirme
  function catCls(list) {
    let u8 = false, ch = false, allLog = true;
    for (let i = 0; i < list.length; i++) {
      const c = list[i].cls;
      if (c === 'uint8') u8 = true; else if (c === 'char') ch = true;
      if (c !== 'logical') allLog = false;
    }
    return u8 ? 'uint8' : ch ? 'char' : allLog ? 'logical' : 'double';
  }
  function catErr(list, horiz) {
    return E(MSG.CAT, TR.CAT + ' (Birleştirilmeye çalışılan boyutlar: ' + list.map(function (v) { return dimStr(v.dims); }).join(horiz ? ' ve ' : ' / ') + ')');
  }
  function concat(vals, horiz) {
    const list = vals.filter(function (v) { return v.data.length > 0; });
    if (!list.length) return vals.length === 1 ? vals[0] : (vals.length && vals.every(function (v) { return v.cls === 'char'; }) ? str('') : empty());
    if (list.length === 1 && vals.length === 1) return list[0];
    const cls = catCls(list);
    const f = list[0];
    const rest = f.dims.slice(2);
    let total = 0, n = 0;
    for (let i = 0; i < list.length; i++) {
      const v = list[i];
      if (!sameDims(v.dims.slice(2), rest) || (horiz ? v.dims[0] !== f.dims[0] : v.dims[1] !== f.dims[1])) throw catErr(list, horiz);
      total += horiz ? v.dims[1] : v.dims[0]; n += v.data.length;
    }
    const out = alloc(n);
    const pages = prod(rest);
    let p = 0;
    if (horiz) {
      const r = f.dims[0];
      for (let pg = 0; pg < pages; pg++) {
        for (let i = 0; i < list.length; i++) {
          const v = list[i], blk = r * v.dims[1];
          out.set(v.data.subarray(pg * blk, (pg + 1) * blk), p); p += blk;
        }
      }
    } else {
      const cols = f.dims[1] * pages;
      for (let c = 0; c < cols; c++) {
        for (let i = 0; i < list.length; i++) {
          const v = list[i], r = v.dims[0];
          out.set(v.data.subarray(c * r, (c + 1) * r), p); p += r;
        }
      }
    }
    if (cls === 'uint8') for (let i = 0; i < n; i++) out[i] = sat8(out[i]);
    const dims = horiz ? [f.dims[0], total].concat(rest) : [total, f.dims[1]].concat(rest);
    return new Val(cls, dims, out);
  }

  // ---------------------------------------------------------------- indeksleme
  function badIdx() { return E(MSG.BADIDX, TR.BADIDX); }
  function linBounds(n) {
    return E('Index exceeds the number of array elements. Index must not exceed ' + n + '.', 'İndeks dizinin eleman sayısını aşıyor: bu dizide ' + n + ' eleman var, daha büyük bir indeks istenemez. Döngü sınırlarını ve indeks hesabını kontrol et.');
  }
  function posBounds(pos, n) {
    return E('Index in position ' + pos + ' exceeds array bounds. Index must not exceed ' + n + '.', (pos === 1 ? 'Satır' : pos === 2 ? 'Sütun' : pos + '. boyut') + ' indeksi matrisin sınırını aşıyor: bu boyutta en fazla ' + n + ' olabilir. Döngü sınırlarını (örn. 1:w-2) ve i+1, j+2 gibi kaydırmaları kontrol et.');
  }
  function toIdx(s) {
    const d = s.data, n = d.length;
    if (s.cls === 'logical') {
      let m = 0;
      for (let i = 0; i < n; i++) if (d[i] !== 0) m++;
      const o = new Int32Array(m);
      for (let i = 0, p = 0; i < n; i++) if (d[i] !== 0) o[p++] = i;
      return o;
    }
    const o = new Int32Array(n);
    for (let i = 0; i < n; i++) {
      const x = d[i];
      if (!(x >= 1) || x !== Math.floor(x) || x > 2147483647) throw badIdx();
      o[i] = x - 1;
    }
    return o;
  }
  function seq(n) { const o = new Int32Array(n); for (let i = 0; i < n; i++) o[i] = i; return o; }
  function effDims(dims, k) {
    const ed = new Array(k);
    if (k >= dims.length) { for (let i = 0; i < k; i++) ed[i] = i < dims.length ? dims[i] : 1; }
    else {
      for (let i = 0; i < k - 1; i++) ed[i] = dims[i];
      let p = 1; for (let i = k - 1; i < dims.length; i++) p *= dims[i];
      ed[k - 1] = p;
    }
    return ed;
  }
  function outerOffsets(lists, ed) {
    let outer = new Int32Array(1), stride = ed[0];
    for (let d = 1; d < lists.length; d++) {
      const L = lists[d], no = new Int32Array(outer.length * L.length);
      let p = 0;
      for (let a = 0; a < L.length; a++) { const base = L[a] * stride; for (let b = 0; b < outer.length; b++) no[p++] = outer[b] + base; }
      outer = no; stride *= ed[d];
    }
    return outer;
  }
  function indexRead(A, subs) {
    const k = subs.length, d = A.data, n = d.length;
    if (k === 1) {
      const s = subs[0];
      if (s === COLON) return new Val(A.cls, [n, 1], d.slice());
      if (s.data.length === 1 && s.cls !== 'logical') {
        const x = s.data[0];
        if (!(x >= 1) || x !== Math.floor(x)) throw badIdx();
        if (x > n) throw linBounds(n);
        const o = new Float64Array(1); o[0] = d[x - 1];
        return new Val(A.cls, [1, 1], o);
      }
      const I = toIdx(s), m = I.length, o = new Float64Array(m);
      for (let i = 0; i < m; i++) { if (I[i] >= n) throw linBounds(n); o[i] = d[I[i]]; }
      const aVec = A.dims.length === 2 && (A.dims[0] === 1) !== (A.dims[1] === 1);
      const sVec = s.dims.length === 2 && (s.dims[0] === 1 || s.dims[1] === 1);
      let dims;
      if (s.cls === 'logical') dims = (aVec ? A.dims[0] === 1 : isRow(s)) ? [1, m] : [m, 1];
      else if (aVec && sVec) dims = A.dims[0] === 1 ? [1, m] : [m, 1];
      else dims = s.dims.slice();
      return new Val(A.cls, dims, o);
    }
    const ed = effDims(A.dims, k);
    if (k === 2) {
      const s0 = subs[0], s1 = subs[1];
      if (s0 !== COLON && s1 !== COLON && s0.data.length === 1 && s1.data.length === 1 && s0.cls !== 'logical' && s1.cls !== 'logical') {
        const x = s0.data[0], y = s1.data[0];
        if (!(x >= 1) || x !== Math.floor(x) || !(y >= 1) || y !== Math.floor(y)) throw badIdx();
        if (x > ed[0]) throw posBounds(1, ed[0]);
        if (y > ed[1]) throw posBounds(2, ed[1]);
        const o = new Float64Array(1); o[0] = d[x - 1 + (y - 1) * ed[0]];
        return new Val(A.cls, [1, 1], o);
      }
    }
    const lists = new Array(k), cnt = new Array(k);
    for (let q = 0; q < k; q++) {
      const s = subs[q];
      let L;
      if (s === COLON) L = seq(ed[q]);
      else { L = toIdx(s); const lim = ed[q]; for (let i = 0; i < L.length; i++) if (L[i] >= lim) throw posBounds(q + 1, lim); }
      lists[q] = L; cnt[q] = L.length;
    }
    const outer = outerOffsets(lists, ed), L0 = lists[0], n0 = L0.length;
    const o = alloc(outer.length * n0);
    let p = 0;
    for (let a = 0; a < outer.length; a++) { const base = outer[a]; for (let i = 0; i < n0; i++) o[p++] = d[base + L0[i]]; }
    return new Val(A.cls, normDims(cnt), o);
  }
  function assignCls(A, rhs, isNew) {
    if (isNew) return rhs.cls;
    if (A.cls === rhs.cls || A.cls === 'uint8' || A.cls === 'double') return A.cls;
    return rhs.cls === 'uint8' ? 'uint8' : 'double';
  }
  function sizeMismatch(cnt, rhs) {
    return E('Unable to perform assignment because the size of the left side is ' + cnt.join('-by-') + ' and the size of the right side is ' + rhs.dims.join('-by-') + '.',
      'Atama yapılamadı: sol tarafta seçtiğin bölge ' + dimStr(cnt) + ' boyutunda ama sağ taraftaki değer ' + dimStr(rhs.dims) + ' boyutunda. İkisi aynı boyutta olmalı (ya da sağ taraf tek bir sayı olmalı).');
  }
  // A: mevcut değer (ya da yeni değişken için null). Yeni/değişmiş Val döner (A yerinde değiştirilebilir).
  function indexAssign(A, subs, rhs) {
    const isNew = !A;
    if (isNew) A = new Val(rhs.cls, [0, 0], new Float64Array(0));
    const k = subs.length;
    if (k === 0) throw E('Invalid assignment: empty index.', 'Atamada parantez içi boş olamaz: A(2,3) = 5 gibi bir indeks yaz.');
    // silme: A(idx) = []
    if (rhs.data.length === 0 && rhs.dims.length === 2 && rhs.dims[0] === 0 && rhs.dims[1] === 0 && rhs.cls === 'double') return indexDelete(A, subs);
    const cls = assignCls(A, rhs, isNew);
    const rd = rhs.data, rn = rd.length;
    const conv = cls === 'uint8' && rhs.cls !== 'uint8';
    if (k === 1) {
      const s = subs[0];
      let d = A.data, n = d.length, dims = A.dims;
      if (s === COLON) {
        if (rn !== 1 && rn !== n) throw E('Unable to perform assignment because the left and right sides have a different number of elements.', 'Atama yapılamadı: sol tarafta ' + n + ' eleman seçili, sağ tarafta ' + rn + ' eleman var. Sayıları eşit olmalı (ya da sağ taraf tek bir sayı olmalı).');
        if (A.cls !== cls) A = new Val(cls, dims.slice(), d.slice()), d = A.data;
        for (let i = 0; i < n; i++) { const x = rn === 1 ? rd[0] : rd[i]; d[i] = conv ? sat8(x) : x; }
        return A;
      }
      const I = toIdx(s), m = I.length;
      if (rn !== 1 && rn !== m) throw E('Unable to perform assignment because the left and right sides have a different number of elements.', 'Atama yapılamadı: sol tarafta ' + m + ' eleman seçili, sağ tarafta ' + rn + ' eleman var. Sayıları eşit olmalı (ya da sağ taraf tek bir sayı olmalı).');
      let mx = 0;
      for (let i = 0; i < m; i++) if (I[i] >= mx) mx = I[i] + 1;
      if (mx > n) {
        let nd;
        if (n === 0) nd = [1, mx];
        else if (dims.length === 2 && dims[0] === 1) nd = [1, mx];
        else if (dims.length === 2 && dims[1] === 1) nd = [mx, 1];
        else throw E('Attempt to grow array along ambiguous index dimension.', 'Matrisi tek indeksle (doğrusal indeks) büyütemezsin; hangi yöne büyüyeceği belirsiz. A(satır, sütun) biçiminde iki indeks kullan.');
        const nw = alloc(mx); nw.set(d);
        A = new Val(cls, nd, nw); d = nw;
      } else if (A.cls !== cls) { A = new Val(cls, dims.slice(), d.slice()); d = A.data; }
      for (let i = 0; i < m; i++) { const x = rn === 1 ? rd[0] : rd[i]; d[I[i]] = conv ? sat8(x) : x; }
      return A;
    }
    const nd0 = A.dims.length;
    const ed = effDims(A.dims, k);
    // hızlı yol: A(i,j) = skaler, sınırlar içinde
    if (k === 2 && rn === 1 && A.cls === cls) {
      const s0 = subs[0], s1 = subs[1];
      if (s0 !== COLON && s1 !== COLON && s0.data.length === 1 && s1.data.length === 1 && s0.cls !== 'logical' && s1.cls !== 'logical') {
        const x = s0.data[0], y = s1.data[0];
        if (!(x >= 1) || x !== Math.floor(x) || !(y >= 1) || y !== Math.floor(y)) throw badIdx();
        if (x <= ed[0] && y <= ed[1]) { A.data[x - 1 + (y - 1) * ed[0]] = conv ? sat8(rd[0]) : rd[0]; return A; }
      }
    }
    const lists = new Array(k), cnt = new Array(k), newDims = new Array(k);
    const emptyA = A.data.length === 0;
    const rdm = rhs.dims.slice(); while (rdm.length < k) rdm.push(1);
    const rns = rhs.dims.filter(function (x) { return x !== 1; });
    let rp = 0;
    for (let q = 0; q < k; q++) {
      const s = subs[q];
      if (s === COLON) {
        let c = ed[q];
        if (emptyA && c === 0) {
          if (rn === 1) c = 1;
          else if (rdm.length === k) c = rdm[q];
          else c = rp < rns.length ? rns[rp++] : 1;
        } else if (emptyA && nd0 <= q && rn !== 1 && rdm.length === k) c = rdm[q];
        lists[q] = seq(c); cnt[q] = c; newDims[q] = Math.max(ed[q], c);
      } else {
        const L = toIdx(s);
        let mx = 0;
        for (let i = 0; i < L.length; i++) if (L[i] >= mx) mx = L[i] + 1;
        lists[q] = L; cnt[q] = L.length; newDims[q] = Math.max(ed[q], mx);
      }
    }
    const total = prod(cnt);
    if (rn !== 1) {
      const lns = cnt.filter(function (x) { return x !== 1; });
      if (rn !== total || !sameDims(lns, rns)) throw sizeMismatch(cnt, rhs);
    }
    let d = A.data;
    if (!sameDims(newDims, ed)) {
      if (k < nd0) throw E('Attempt to grow array along ambiguous index dimension.', 'Çok boyutlu bir matrisi, boyut sayısından az indeksle büyütemezsin. Tüm boyutlar için indeks yaz: A(satır, sütun, katman).');
      const nw = alloc(prod(newDims));
      const oldN = d.length;
      if (oldN > 0) {
        if (newDims[0] === ed[0] && k === 2) nw.set(d);
        else {
          const r0 = ed[0], colsOld = oldN / r0;
          // eski sütun-bloklarını yeni konumlarına taşı
          const sub = new Array(k).fill(0);
          const strides = new Array(k); let st = 1;
          for (let q = 0; q < k; q++) { strides[q] = st; st *= newDims[q]; }
          for (let c = 0; c < colsOld; c++) {
            let off = 0;
            for (let q = 1; q < k; q++) off += sub[q] * strides[q];
            nw.set(d.subarray(c * r0, (c + 1) * r0), off);
            for (let q = 1; q < k; q++) { if (++sub[q] < ed[q]) break; sub[q] = 0; }
          }
        }
      }
      A = new Val(cls, normDims(newDims), nw); d = nw;
    } else if (A.cls !== cls) { A = new Val(cls, A.dims.slice(), d.slice()); d = A.data; }
    else if (emptyA && isNew) { A = new Val(cls, normDims(newDims), d); }
    const outer = outerOffsets(lists, newDims), L0 = lists[0], n0 = L0.length;
    let p = 0;
    if (rn === 1) {
      const x = conv ? sat8(rd[0]) : rd[0];
      for (let a = 0; a < outer.length; a++) { const base = outer[a]; for (let i = 0; i < n0; i++) d[base + L0[i]] = x; }
    } else {
      for (let a = 0; a < outer.length; a++) { const base = outer[a]; for (let i = 0; i < n0; i++) { const x = rd[p++]; d[base + L0[i]] = conv ? sat8(x) : x; } }
    }
    return A;
  }
  function indexDelete(A, subs) {
    const k = subs.length;
    if (k === 1) {
      if (subs[0] === COLON) return new Val(A.cls, [0, 0], new Float64Array(0));
      const I = toIdx(subs[0]), n = A.data.length, del = new Uint8Array(n);
      for (let i = 0; i < I.length; i++) { if (I[i] >= n) throw E('Matrix index is out of range for deletion.', 'Silinmek istenen indeks dizinin eleman sayısını (' + n + ') aşıyor.'); del[I[i]] = 1; }
      const keep = [];
      for (let i = 0; i < n; i++) if (!del[i]) keep.push(A.data[i]);
      const col = A.dims.length === 2 && A.dims[1] === 1 && A.dims[0] !== 1;
      return new Val(A.cls, col ? [keep.length, 1] : [1, keep.length], Float64Array.from(keep));
    }
    if (k === 2 && A.dims.length === 2) {
      const r = A.dims[0], c = A.dims[1];
      const dimDel = subs[0] === COLON ? 1 : subs[1] === COLON ? 0 : -1;
      if (dimDel >= 0) {
        const lim = dimDel === 0 ? r : c;
        const I = subs[dimDel] === COLON ? seq(lim) : toIdx(subs[dimDel]);
        const del = new Uint8Array(lim);
        for (let i = 0; i < I.length; i++) { if (I[i] >= lim) throw E('Matrix index is out of range for deletion.', 'Silinmek istenen satır/sütun matrisin sınırını (' + lim + ') aşıyor.'); del[I[i]] = 1; }
        const keep = [];
        for (let i = 0; i < lim; i++) if (!del[i]) keep.push(i);
        const nr = dimDel === 0 ? keep.length : r, nc = dimDel === 1 ? keep.length : c;
        const o = new Float64Array(nr * nc);
        for (let j = 0; j < nc; j++) for (let i = 0; i < nr; i++) {
          const si = dimDel === 0 ? keep[i] : i, sj = dimDel === 1 ? keep[j] : j;
          o[i + j * nr] = A.data[si + sj * r];
        }
        return new Val(A.cls, [nr, nc], o);
      }
    }
    throw E('A null assignment can have only one non-colon index.', 'Silme işleminde (= []) yalnızca bir indeks ":" dışında olabilir: bütün bir satırı A(2,:) = [] ya da bütün bir sütunu A(:,3) = [] biçiminde silebilirsin.');
  }

  // ---------------------------------------------------------------- indirgeme yardımcıları
  let LAST_IDX = 0;
  function firstNS(v) { for (let i = 0; i < v.dims.length; i++) if (v.dims[i] !== 1) return i; return 0; }
  function scalarArg(v, what) {
    if (!v || v.data.length !== 1) throw E('Expected a scalar value for ' + (what || 'argument') + '.', 'Bu argüman tek bir sayı (skaler) olmalı.');
    return v.data[0];
  }
  function dimArg(v, a, idx) {
    if (a.length > idx) {
      if (a[idx].cls === 'char') { if (charStr(a[idx]) === 'all') return -1; throw E('Invalid option: \'' + charStr(a[idx]) + '\'.', 'Bu fonksiyon için geçersiz seçenek: \'' + charStr(a[idx]) + '\'.'); }
      const k = scalarArg(a[idx], 'dim');
      if (!(k >= 1) || k !== Math.floor(k)) throw E('Dimension argument must be a positive integer scalar within indexing range.', 'Boyut argümanı 1 (sütunlar boyunca) ya da 2 (satırlar boyunca) gibi pozitif bir tam sayı olmalı.');
      return k - 1;
    }
    return firstNS(v);
  }
  function reduce(v, dim, fn, outCls, wantIdx) {
    const d = v.data, dims = v.dims;
    let res, idxV = null;
    if (dim < 0) {
      const o = new Float64Array(1); o[0] = fn(d.slice());
      res = new Val(outCls, [1, 1], o);
      if (wantIdx) idxV = num(LAST_IDX + 1);
    } else {
      let stride = 1;
      for (let i = 0; i < dim && i < dims.length; i++) stride *= dims[i];
      const len = dim < dims.length ? dims[dim] : 1;
      const od = dims.slice(); if (dim < od.length) od[dim] = 1;
      const on = prod(od), o = new Float64Array(on), io = wantIdx ? new Float64Array(on) : null;
      const buf = new Float64Array(len), block = stride * len;
      if (block === 0) { const x = fn(buf); for (let i = 0; i < on; i++) o[i] = x; }
      else {
        const outer = d.length / block;
        for (let a = 0; a < outer; a++) for (let s = 0; s < stride; s++) {
          const base = a * block + s;
          for (let q = 0; q < len; q++) buf[q] = d[base + q * stride];
          o[a * stride + s] = fn(buf);
          if (io) io[a * stride + s] = LAST_IDX + 1;
        }
      }
      res = new Val(outCls, normDims(od), o);
      if (io) idxV = new Val('double', normDims(od), io);
    }
    if (outCls === 'uint8') { const o = res.data; for (let i = 0; i < o.length; i++) o[i] = sat8(o[i]); }
    return wantIdx ? [res, idxV] : res;
  }
  function fsum(b) { let s = 0; for (let i = 0; i < b.length; i++) s += b[i]; return s; }
  function fprod(b) { let s = 1; for (let i = 0; i < b.length; i++) s *= b[i]; return s; }
  function fmean(b) { let s = 0; for (let i = 0; i < b.length; i++) s += b[i]; return s / b.length; }
  function fmedian(b) {
    const n = b.length;
    if (n === 0) return NaN;
    if (n <= 32) {
      for (let i = 1; i < n; i++) { const x = b[i]; if (x !== x) return NaN; let j = i - 1; while (j >= 0 && b[j] > x) { b[j + 1] = b[j]; j--; } b[j + 1] = x; }
      if (b[0] !== b[0]) return NaN;
    } else { for (let i = 0; i < n; i++) if (b[i] !== b[i]) return NaN; b.sort(); }
    return (n & 1) ? b[(n - 1) >> 1] : (b[n / 2 - 1] + b[n / 2]) / 2;
  }
  function fmax(b) { let m = NaN, k = 0; for (let i = 0; i < b.length; i++) { const x = b[i]; if (x > m || (m !== m && x === x)) { m = x; k = i; } } LAST_IDX = k; return m; }
  function fmin(b) { let m = NaN, k = 0; for (let i = 0; i < b.length; i++) { const x = b[i]; if (x < m || (m !== m && x === x)) { m = x; k = i; } } LAST_IDX = k; return m; }
  function fany(b) { for (let i = 0; i < b.length; i++) if (b[i] !== 0 && b[i] === b[i]) return 1; return 0; }
  function fall(b) { for (let i = 0; i < b.length; i++) if (b[i] === 0) return 0; return 1; }

  function need(name, a, lo, hi) {
    if (a.length < lo) throw E('Not enough input arguments.', '"' + name + '" fonksiyonuna eksik argüman verildi (en az ' + lo + ' argüman gerekir).');
    if (a.length > hi) throw E('Too many input arguments.', '"' + name + '" fonksiyonuna fazla argüman verildi (en fazla ' + hi + ' argüman alır).');
  }
  function map1(v, fn, cls) {
    const d = v.data, n = d.length, o = new Float64Array(n);
    for (let i = 0; i < n; i++) o[i] = fn(d[i]);
    return new Val(cls || (v.cls === 'uint8' ? 'uint8' : 'double'), v.dims.slice(), o);
  }
  function dimsFromArgs(name, a) {
    let cls = 'double';
    a = a.slice();
    if (a.length && a[a.length - 1].cls === 'char') {
      cls = charStr(a.pop());
      if (cls === 'like') throw E('The \'like\' option is not supported.', '\'like\' seçeneği bu ortamda desteklenmiyor.');
      if (['double', 'uint8', 'logical'].indexOf(cls) < 0) throw E('Unsupported class \'' + cls + '\'.', 'Bu ortamda yalnızca \'double\', \'uint8\' ve \'logical\' sınıfları destekleniyor.');
    }
    let dims;
    if (a.length === 0) dims = [1, 1];
    else if (a.length === 1) {
      const d = a[0].data;
      if (d.length === 1) dims = [d[0], d[0]];
      else if (d.length === 0) throw E('Size vector should be a row vector with real elements.', '"' + name + '" için boyut verilmeli: ' + name + '(2,3) gibi.');
      else dims = Array.from(d);
    } else dims = a.map(function (v) { return scalarArg(v, 'size'); });
    for (let i = 0; i < dims.length; i++) {
      const x = dims[i];
      if (x !== x || x !== Math.floor(x)) throw E('Size inputs must be integers.', '"' + name + '" fonksiyonuna verilen boyutlar tam sayı olmalı (örn. ' + name + '(2,3)).');
      if (x < 0) dims[i] = 0;
    }
    return { dims: normDims(dims), cls: cls };
  }
  function filled(name, a, x) {
    const r = dimsFromArgs(name, a);
    const o = alloc(prod(r.dims));
    if (x !== 0) o.fill(x);
    return new Val(r.cls, r.dims, o);
  }
  function noInt(name, v) {
    if (v.cls === 'uint8') throw E("Undefined function '" + name + "' for input arguments of type 'uint8'.", '"' + name + '" uint8 değerlerle çalışmaz. Önce double(...) ile çevir: ' + name + '(double(x)).');
  }
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // ---------------------------------------------------------------- sentetik görüntü
  let IMG_CACHE = null;
  const NAMED_IMG = Object.create(null); // ada göre kayıtlı örnek resimler (cameraman, football…)
  let USER_IMG = null; // kullanıcının yüklediği 256×256 gri resim (sütun-öncelikli); yoksa sentetik resim kullanılır
  function makeImage() {
    if (IMG_CACHE) return IMG_CACHE;
    const N = 256, d = new Float64Array(N * N);
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        let g = 185 - 60 * (r / 255) + 45 * (c / 255);               // gökyüzü gradyanı
        if (r >= 196) g = 92 + 38 * (c / 255) + 12 * ((r - 196) / 59); // zemin
        const dx = c - 200, dy = r - 52;
        if (dx * dx + dy * dy <= 26 * 26) g = 245;                    // parlak daire
        if (r >= 110 && r < 196 && c >= 150 && c < 232) {             // bina (dikdörtgen)
          g = 135;
          if (r >= 118 && r < 188 && c >= 158 && c < 226 && (r - 118) % 26 < 14 && (c - 158) % 24 < 12) g = 215; // pencereler
        }
        if (r >= 134 && r < 246) {                                    // üçayak
          const t = (r - 134) / 112;
          if (Math.abs(c - (135 - 18 * t)) <= 1.5 || Math.abs(c - 135) <= 1.5 || Math.abs(c - (135 + 18 * t)) <= 1.5) g = 35;
        }
        if (r >= 108 && r < 134 && c >= 122 && c < 148) g = 42;       // kamera
        if (r >= 118 && r < 130 && c >= 94 && c < 124) g = 30;        // kol
        if (r >= 205 && r < 246 && ((c >= 66 && c < 79) || (c >= 85 && c < 98))) g = 26; // bacaklar
        if (r >= 104 && r < 205 && Math.abs(c - 82) <= 14 + (r - 104) * 0.13) g = 22;   // gövde
        const hx = c - 82, hy = r - 88;
        if (hx * hx + hy * hy <= 17 * 17) g = 30;                     // baş
        d[r + c * N] = sat8(g);
      }
    }
    IMG_CACHE = d;
    return d;
  }

  // ---------------------------------------------------------------- biçimlendirme (çıktı)
  function padL(s, w) { return s.length >= w ? s : ' '.repeat(w - s.length) + s; }
  function expFmt(x) {
    let s = x.toExponential(4);
    return s.replace(/e([+-])(\d)$/, 'e$10$2');
  }
  function intStr(x) { return x !== x ? 'NaN' : x === Infinity ? 'Inf' : x === -Infinity ? '-Inf' : x === 0 ? '0' : String(x); }
  const BIG_DISPLAY = 2000;
  // 2B bir sayfanın satırlarını üretir
  function rowsText(cls, data, r, c, off, noTrunc) {
    let note = '';
    let R = r, C = c;
    if (!noTrunc && r * c > BIG_DISPLAY) {
      R = Math.min(r, 10); C = Math.min(c, 10);
      note = '  (' + r + '×' + c + ' matris çok büyük: yalnızca sol üst ' + R + '×' + C + ' köşesi gösteriliyor. Satır sonuna ; koyarsan ekrana yazılmaz.)\n';
    }
    const cells = new Array(R * C);
    let w = 0, pre = '';
    if (cls === 'char') {
      let s = '';
      for (let i = 0; i < r; i++) { let t = ''; for (let j = 0; j < c; j++) t += String.fromCharCode(data[off + i + j * r]); s += t + '\n'; }
      return s;
    }
    if (cls === 'logical' || cls === 'uint8') {
      let ml = 1;
      for (let j = 0; j < C; j++) for (let i = 0; i < R; i++) { const s = String(data[off + i + j * r]); cells[i + j * R] = s; if (s.length > ml) ml = s.length; }
      w = ml + 3;
    } else {
      let allInt = true, maxAbs = 0;
      for (let j = 0; j < C; j++) for (let i = 0; i < R; i++) {
        const x = data[off + i + j * r];
        if (isFinite(x)) { if (x !== Math.floor(x)) allInt = false; const a = Math.abs(x); if (a > maxAbs) maxAbs = a; }
      }
      if (allInt && maxAbs < 1e10) {
        let ml = 1;
        for (let j = 0; j < C; j++) for (let i = 0; i < R; i++) { const s = intStr(data[off + i + j * r]); cells[i + j * R] = s; if (s.length > ml) ml = s.length; }
        const digits = String(maxAbs).length;
        w = (digits <= 3 && ml <= 4) ? 6 : Math.max(12, ml + 2);
      } else if (R * C === 1) {
        const x = data[off], a = Math.abs(x);
        return (a >= 1000 || a < 0.001) ? '   ' + expFmt(x) + '\n' : padL(x.toFixed(4), 10) + '\n';
      } else {
        let f = 1;
        if (maxAbs >= 1000 || (maxAbs < 0.001 && maxAbs > 0)) {
          const e = Math.floor(Math.log10(maxAbs));
          f = Math.pow(10, e);
          pre = '   1.0e' + (e < 0 ? '-' : '+') + padL(String(Math.abs(e)), 2).replace(' ', '0') + ' *\n';
        }
        for (let j = 0; j < C; j++) for (let i = 0; i < R; i++) {
          const x = data[off + i + j * r];
          cells[i + j * R] = !isFinite(x) ? intStr(x) : x === 0 ? '0' : (x / f).toFixed(4);
        }
        w = 10;
        for (let q = 0; q < cells.length; q++) if (cells[q].length + 2 > w) w = cells[q].length + 2;
      }
    }
    let s = note + pre;
    const per = Math.max(1, Math.floor(80 / w));
    if (C <= per) {
      for (let i = 0; i < R; i++) { let ln = ''; for (let j = 0; j < C; j++) ln += padL(cells[i + j * R], w); s += ln + '\n'; }
    } else {
      for (let j0 = 0; j0 < C; j0 += per) {
        const j1 = Math.min(C, j0 + per);
        s += (j1 - j0 === 1 ? '  Column ' + (j0 + 1) : '  Columns ' + (j0 + 1) + ' through ' + j1) + '\n';
        for (let i = 0; i < R; i++) { let ln = ''; for (let j = j0; j < j1; j++) ln += padL(cells[i + j * R], w); s += ln + '\n'; }
        if (j1 < C) s += '\n';
      }
    }
    return s;
  }
  function shapeWord(v) {
    if (v.cls === 'char' || v.cls === 'logical' || v.dims.length > 2) return 'array';
    if (v.dims[0] === 1) return 'row vector';
    if (v.dims[1] === 1) return 'column vector';
    return 'matrix';
  }
  function classHeader(v) {
    const n = v.data.length;
    if (v.cls === 'double' || v.cls === 'char') return '';
    if (n === 1) return '  ' + v.cls + '\n';
    return '  ' + dimStr(v.dims) + ' ' + v.cls + ' ' + shapeWord(v) + '\n';
  }
  function bodyText(v, forDisp, noTrunc) {
    const n = v.data.length, d = v.dims;
    if (n === 0) {
      if (forDisp) return (v.cls === 'char') ? '\n' : '';
      if (d.length === 2 && d[0] === 0 && d[1] === 0) return v.cls === 'double' ? '     []\n' : v.cls === 'char' ? "  0×0 empty char array\n" : '  0×0 empty ' + v.cls + ' ' + (v.cls === 'logical' ? 'array' : 'matrix') + '\n';
      return '  ' + dimStr(d) + ' empty ' + v.cls + ' ' + shapeWord(v) + '\n';
    }
    const r = d[0], c = d[1];
    if (v.cls === 'char' && d.length === 2) {
      if (forDisp) return rowsText('char', v.data, r, c, 0);
      let s = '';
      for (let i = 0; i < r; i++) { let t = ''; for (let j = 0; j < c; j++) t += String.fromCharCode(v.data[i + j * r]); s += "    '" + t + "'\n"; }
      return s;
    }
    if (d.length === 2) return (forDisp ? '' : classHeader(v)) + rowsText(v.cls, v.data, r, c, 0, noTrunc);
    let s = '';
    const pages = n / (r * c);
    for (let p = 0; p < pages; p++) s += '(:,:,' + (p + 1) + ') =\n' + rowsText(v.cls, v.data, r, c, p * r * c, noTrunc) + (p < pages - 1 ? '\n' : '');
    return s;
  }
  function formatNamed(name, v, noTrunc) {
    const d = v.dims;
    if (d.length > 2 && v.data.length > 0) {
      const r = d[0], c = d[1], pages = v.data.length / (r * c);
      let s = classHeader(v); if (s) s += '\n';
      for (let p = 0; p < pages; p++) s += name + '(:,:,' + (p + 1) + ') =\n' + rowsText(v.cls, v.data, r, c, p * r * c, noTrunc) + '\n';
      return s;
    }
    return name + ' =\n' + bodyText(v, false, noTrunc) + '\n';
  }
  function snapshot(v) {
    const d = v.dims, r = d[0], c = d[1], data = v.data;
    let out;
    if (v.cls === 'char') {
      if (d.length === 2 && r <= 1) out = charStr(v);
      else { out = []; for (let i = 0; i < r; i++) { let t = ''; for (let j = 0; j < c; j++) t += String.fromCharCode(data[i + j * r]); out.push(t); } }
    } else {
      const page = function (off) {
        const rows = new Array(r);
        for (let i = 0; i < r; i++) { const row = new Array(c); for (let j = 0; j < c; j++) row[j] = data[off + i + j * r]; rows[i] = row; }
        return rows;
      };
      if (d.length === 2) out = page(0);
      else { out = []; const pages = r * c ? data.length / (r * c) : 0; for (let p = 0; p < pages; p++) out.push(page(p * r * c)); }
    }
    return { cls: v.cls, size: d.slice(), data: out };
  }
  function fromSnapshot(s) {
    if (s instanceof Val) return s;
    if (typeof s === 'number') return num(s);
    if (typeof s === 'boolean') return bool(s);
    if (typeof s === 'string') return str(s);
    if (Array.isArray(s)) {
      const rows = (s.length && !Array.isArray(s[0])) ? [s] : s;
      s = { cls: 'double', size: [rows.length, rows.length ? rows[0].length : 0], data: rows };
    }
    const cls = s.cls || 'double';
    if (cls === 'char') {
      if (typeof s.data === 'string') return str(s.data);
      const rows = s.data || [], r = rows.length, c = r ? rows[0].length : 0, o = new Float64Array(r * c);
      for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) o[i + j * r] = rows[i].charCodeAt(j);
      return new Val('char', [r, c], o);
    }
    const size = s.size.slice(), r = size[0], c = size[1], n = prod(size), o = new Float64Array(n);
    const pages = size.length > 2 ? s.data : [s.data];
    for (let p = 0; p < pages.length; p++) for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) o[p * r * c + i + j * r] = Number(pages[p][i][j]);
    return new Val(cls, size, o);
  }

  // ---------------------------------------------------------------- sprintf / num2str
  function num2strScalar(x, prec) {
    if (x !== x) return 'NaN';
    if (!isFinite(x)) return x > 0 ? 'Inf' : '-Inf';
    if (x === Math.floor(x)) return String(x);
    if (prec !== undefined) return String(Number(x.toPrecision(prec)));
    const a = Math.abs(x);
    const p = Math.max(1, Math.floor(Math.log10(a)) + 5);
    return String(Number(x.toPrecision(Math.min(p, 16))));
  }
  function sprintfImpl(fmt, args) {
    const flat = [];
    for (let i = 0; i < args.length; i++) {
      const v = args[i];
      if (v.cls === 'char') flat.push(charStr(v)); else for (let q = 0; q < v.data.length; q++) flat.push(v.data[q]);
    }
    const re = /%%|%(-?)(\d*)(?:\.(\d+))?([dicsfge])|\\n|\\t|\\\\/g;
    let out = '', ai = 0, guard = 0;
    do {
      let used = false;
      out += fmt.replace(re, function (m, minus, width, precS, conv) {
        if (m === '%%') return '%';
        if (m === '\\n') return '\n';
        if (m === '\\t') return '\t';
        if (m === '\\\\') return '\\';
        if (ai >= flat.length) return '';
        const x = flat[ai++]; used = true;
        let s;
        const prec = precS === undefined ? -1 : parseInt(precS, 10);
        if (typeof x === 'string') s = (conv === 's' || conv === 'c') ? x : Array.from(x).map(function (ch) { return ch.charCodeAt(0); }).join('');
        else if (conv === 'd' || conv === 'i') s = x === Math.floor(x) ? intStr(x) : expFmt(x);
        else if (conv === 'f') s = isFinite(x) ? x.toFixed(prec < 0 ? 6 : prec) : intStr(x);
        else if (conv === 'e') s = isFinite(x) ? x.toExponential(prec < 0 ? 6 : prec).replace(/e([+-])(\d)$/, 'e$10$2') : intStr(x);
        else if (conv === 'g') s = isFinite(x) ? String(Number(x.toPrecision(prec <= 0 ? 6 : prec))) : intStr(x);
        else if (conv === 'c') s = String.fromCharCode(x);
        else s = x === Math.floor(x) ? intStr(x) : num2strScalar(x);
        const w = width ? parseInt(width, 10) : 0;
        if (s.length < w) s = minus ? s + ' '.repeat(w - s.length) : (width[0] === '0' && typeof x === 'number' ? '0'.repeat(w - s.length) + s : ' '.repeat(w - s.length) + s);
        return s;
      });
      if (!used) break;
    } while (ai < flat.length && ++guard < 100000);
    return out;
  }

  // ---------------------------------------------------------------- yerleşik fonksiyonlar
  const B = Object.create(null);
  B.size = function (I, a, nout) {
    need('size', a, 1, 2);
    const d = a[0].dims;
    if (a.length === 2) { const k = scalarArg(a[1], 'dim'); if (!(k >= 1) || k !== Math.floor(k)) throw E('Dimension argument must be a positive integer scalar within indexing range.', 'size(A, k) için k pozitif tam sayı olmalı: 1 → satır sayısı, 2 → sütun sayısı.'); return num(k <= d.length ? d[k - 1] : 1); }
    if (nout <= 1) return rowVec(d);
    const out = [];
    for (let i = 0; i < nout; i++) {
      if (i < nout - 1) out.push(num(i < d.length ? d[i] : 1));
      else { let p = 1; for (let j = i; j < d.length; j++) p *= d[j]; out.push(num(p)); }
    }
    return out;
  };
  B.numel = function (I, a) { need('numel', a, 1, 1); return num(a[0].data.length); };
  B.length = function (I, a) { need('length', a, 1, 1); return num(a[0].data.length === 0 ? 0 : Math.max.apply(null, a[0].dims)); };
  B.ndims = function (I, a) { need('ndims', a, 1, 1); return num(a[0].dims.length); };
  B.isempty = function (I, a) { need('isempty', a, 1, 1); return bool(a[0].data.length === 0); };
  B.zeros = function (I, a) { return filled('zeros', a, 0); };
  B.ones = function (I, a) { return filled('ones', a, 1); };
  B.true = function (I, a) { const v = filled('true', a, 1); v.cls = 'logical'; return v; };
  B.false = function (I, a) { const v = filled('false', a, 0); v.cls = 'logical'; return v; };
  B.eye = function (I, a) {
    const v = filled('eye', a, 0);
    if (v.dims.length > 2) throw E('N-dimensional arrays are not supported.', 'eye yalnızca 2 boyutlu matris üretir: eye(3) ya da eye(2,3).');
    const m = Math.min(v.dims[0], v.dims[1]);
    for (let i = 0; i < m; i++) v.data[i + i * v.dims[0]] = 1;
    return v;
  };
  B.rand = function (I, a) { const v = filled('rand', a, 0); for (let i = 0; i < v.data.length; i++) v.data[i] = I.rng(); return v; };
  B.randi = function (I, a) {
    need('randi', a, 1, 4);
    const lim = a[0].data; let lo = 1, hi = lim[0];
    if (lim.length >= 2) { lo = lim[0]; hi = lim[1]; }
    const v = filled('randi', a.slice(1), 0);
    for (let i = 0; i < v.data.length; i++) v.data[i] = lo + Math.floor(I.rng() * (hi - lo + 1));
    return v;
  };
  B.pi = function () { return num(Math.PI); };
  B.Inf = B.inf = function () { return num(Infinity); };
  B.NaN = B.nan = function () { return num(NaN); };
  B.eps = function () { return num(2.220446049250313e-16); };
  B.sum = function (I, a) {
    need('sum', a, 1, 2); const v = a[0];
    if (v.data.length === 0 && v.dims.length === 2 && v.dims[0] === 0 && v.dims[1] === 0) return num(0);
    return reduce(v, dimArg(v, a, 1), fsum, 'double');
  };
  B.prod = function (I, a) {
    need('prod', a, 1, 2); const v = a[0];
    if (v.data.length === 0 && v.dims[0] === 0 && v.dims[1] === 0) return num(1);
    return reduce(v, dimArg(v, a, 1), fprod, 'double');
  };
  B.mean = function (I, a) {
    need('mean', a, 1, 2); const v = a[0];
    if (v.data.length === 0 && v.dims[0] === 0 && v.dims[1] === 0) return num(NaN);
    return reduce(v, dimArg(v, a, 1), fmean, 'double');
  };
  B.median = function (I, a) {
    need('median', a, 1, 2); const v = a[0];
    if (v.data.length === 0 && v.dims[0] === 0 && v.dims[1] === 0) return num(NaN);
    return reduce(v, dimArg(v, a, 1), fmedian, v.cls === 'uint8' ? 'uint8' : 'double');
  };
  function minmax(name, a, nout, isMax) {
    need(name, a, 1, 3);
    if (a.length >= 2 && a[1].data.length > 0) {
      if (a.length === 3) throw E('MAX/MIN with two matrices to compare and a working dimension is not supported.', name + '(A, B) biçiminde iki değer karşılaştırılırken üçüncü argüman verilemez. Boyut belirtmek için ' + name + '(A, [], 2) yaz.');
      const x = a[0], y = a[1];
      const cls = (x.cls === 'uint8' || y.cls === 'uint8') ? 'uint8' : (x.cls === y.cls ? x.cls : 'double');
      return bsx(x, y, isMax ? function (p, q) { return (p >= q || q !== q) ? p : q; } : function (p, q) { return (p <= q || q !== q) ? p : q; }, cls);
    }
    const v = a[0];
    if (v.data.length === 0) return [empty(), empty()];
    const dim = a.length === 3 ? dimArg(v, a, 2) : firstNS(v);
    return reduce(v, dim, isMax ? fmax : fmin, v.cls, true);
  }
  B.max = function (I, a, nout) { return minmax('max', a, nout, true); };
  B.min = function (I, a, nout) { return minmax('min', a, nout, false); };
  B.any = function (I, a) { need('any', a, 1, 2); const v = a[0]; if (v.data.length === 0) return bool(false); return reduce(v, dimArg(v, a, 1), fany, 'logical'); };
  B.all = function (I, a) { need('all', a, 1, 2); const v = a[0]; if (v.data.length === 0) return bool(true); return reduce(v, dimArg(v, a, 1), fall, 'logical'); };
  B.abs = function (I, a) { need('abs', a, 1, 1); return map1(a[0], Math.abs); };
  B.sqrt = function (I, a) {
    need('sqrt', a, 1, 1); noInt('sqrt', a[0]);
    return map1(a[0], function (x) { if (x < 0) throw complexErr(); return Math.sqrt(x); });
  };
  B.round = function (I, a) { need('round', a, 1, 1); return map1(a[0], mround); };
  B.floor = function (I, a) { need('floor', a, 1, 1); return map1(a[0], Math.floor); };
  B.ceil = function (I, a) { need('ceil', a, 1, 1); return map1(a[0], Math.ceil); };
  B.fix = function (I, a) { need('fix', a, 1, 1); return map1(a[0], Math.trunc); };
  ['exp', 'log', 'log2', 'log10', 'sin', 'cos', 'tan'].forEach(function (nm) {
    B[nm] = function (I, a) {
      need(nm, a, 1, 1); noInt(nm, a[0]);
      return map1(a[0], nm.indexOf('log') === 0 ? function (x) { if (x < 0) throw complexErr(); return Math[nm](x); } : Math[nm]);
    };
  });
  B.mod = function (I, a) {
    need('mod', a, 2, 2);
    return bsx(a[0], a[1], function (x, y) { if (y === 0) return x; const r = x - Math.floor(x / y) * y; return r; }, arithCls(a[0], a[1]));
  };
  B.rem = function (I, a) {
    need('rem', a, 2, 2);
    return bsx(a[0], a[1], function (x, y) { if (y === 0) return NaN; return x - Math.trunc(x / y) * y; }, arithCls(a[0], a[1]));
  };
  B.find = function (I, a, nout) {
    need('find', a, 1, 2);
    const v = a[0], d = v.data, lim = a.length > 1 ? scalarArg(a[1], 'n') : Infinity;
    const idx = [];
    for (let i = 0; i < d.length && idx.length < lim; i++) if (d[i] !== 0) idx.push(i);
    const m = idx.length;
    const dims = (isRow(v) && v.dims[1] !== 1) ? [1, m] : (d.length === 0 && v.dims[0] === 0 && v.dims[1] === 0 ? [0, 0] : [m, 1]);
    if (nout >= 2) {
      const r = v.dims[0], ro = new Float64Array(m), co = new Float64Array(m);
      for (let i = 0; i < m; i++) { ro[i] = idx[i] % r + 1; co[i] = Math.floor(idx[i] / r) + 1; }
      return [new Val('double', dims.slice(), ro), new Val('double', dims.slice(), co)];
    }
    const o = new Float64Array(m);
    for (let i = 0; i < m; i++) o[i] = idx[i] + 1;
    return new Val('double', dims, o);
  };
  B.sort = function (I, a, nout) {
    need('sort', a, 1, 3);
    const v = a[0];
    let desc = false, dim = firstNS(v);
    for (let i = 1; i < a.length; i++) {
      if (a[i].cls === 'char') {
        const s = charStr(a[i]).toLowerCase();
        if (s === 'descend') desc = true; else if (s !== 'ascend') throw E("Sorting direction must be 'ascend' or 'descend'.", "sort için yön 'ascend' (küçükten büyüğe) ya da 'descend' (büyükten küçüğe) olmalı.");
      } else dim = dimArg(v, a, i);
    }
    const d = v.data, dims = v.dims, o = new Float64Array(d.length), io = new Float64Array(d.length);
    let stride = 1;
    for (let i = 0; i < dim && i < dims.length; i++) stride *= dims[i];
    const len = dim < dims.length ? dims[dim] : 1, block = stride * len;
    const outer = block ? d.length / block : 0;
    const ord = new Array(len);
    for (let q = 0; q < outer; q++) for (let s = 0; s < stride; s++) {
      const base = q * block + s;
      for (let k = 0; k < len; k++) ord[k] = k;
      ord.sort(function (x, y) {
        const p = d[base + x * stride], r = d[base + y * stride];
        if (p !== p || r !== r) return (p !== p ? 1 : 0) - (r !== r ? 1 : 0) || x - y;
        return (desc ? r - p : p - r) || x - y;
      });
      for (let k = 0; k < len; k++) { o[base + k * stride] = d[base + ord[k] * stride]; io[base + k * stride] = ord[k] + 1; }
    }
    return [new Val(v.cls, dims.slice(), o), new Val('double', dims.slice(), io)];
  };
  B.cumsum = function (I, a) {
    need('cumsum', a, 1, 2);
    const v = a[0], dim = dimArg(v, a, 1), d = v.data, dims = v.dims, o = new Float64Array(d.length);
    let stride = 1;
    for (let i = 0; i < dim && i < dims.length; i++) stride *= dims[i];
    const len = dim < dims.length ? dims[dim] : 1, block = stride * len, outer = block ? d.length / block : 0;
    for (let q = 0; q < outer; q++) for (let s = 0; s < stride; s++) { let acc = 0; for (let k = 0; k < len; k++) { acc += d[q * block + s + k * stride]; o[q * block + s + k * stride] = acc; } }
    return new Val('double', dims.slice(), o);
  };
  B.double = function (I, a) { need('double', a, 1, 1); return toCls(a[0], 'double'); };
  B.uint8 = function (I, a) { need('uint8', a, 1, 1); return toCls(a[0], 'uint8'); };
  B.logical = function (I, a) { need('logical', a, 1, 1); return toCls(a[0], 'logical'); };
  B.class = function (I, a) { need('class', a, 1, 1); return str(a[0].cls); };
  B.linspace = function (I, a) {
    need('linspace', a, 2, 3);
    const x = scalarArg(a[0]), y = scalarArg(a[1]), n = a.length > 2 ? Math.floor(scalarArg(a[2])) : 100;
    const o = alloc(Math.max(0, n));
    for (let i = 0; i < n; i++) o[i] = n === 1 ? y : x + (y - x) * i / (n - 1);
    return new Val('double', [1, Math.max(0, n)], o);
  };
  B.reshape = function (I, a) {
    need('reshape', a, 2, 5);
    const v = a[0];
    let dims = a.length === 2 ? Array.from(a[1].data) : a.slice(1).map(function (x) { return x.data.length ? x.data[0] : -1; });
    const unk = dims.indexOf(-1);
    if (unk >= 0) { const rest = dims.reduce(function (p, x) { return x === -1 ? p : p * x; }, 1); dims[unk] = rest ? v.data.length / rest : 0; }
    if (dims.length < 2) dims.push(1);
    if (prod(dims) !== v.data.length || dims.some(function (x) { return x !== Math.floor(x) || x < 0; })) throw E('Number of elements must not change. Use [] as one of the size inputs to automatically calculate the appropriate size for that dimension.', 'reshape eleman sayısını değiştiremez: ' + v.data.length + ' elemanlı bir dizi, ' + dimStr(dims) + ' boyutuna (' + prod(dims) + ' eleman) dönüştürülemez.');
    return new Val(v.cls, normDims(dims), v.data.slice());
  };
  B.disp = function (I, a) { need('disp', a, 1, 1); I.out += bodyText(a[0], true); return []; };
  B.display = function (I, a) { need('display', a, 1, 1); I.out += formatNamed('ans', a[0]); return []; };
  B.num2str = function (I, a) {
    need('num2str', a, 1, 2);
    const v = a[0];
    if (v.cls === 'char') return v;
    const prec = a.length > 1 && a[1].cls !== 'char' ? scalarArg(a[1]) : undefined;
    if (a.length > 1 && a[1].cls === 'char') return str(sprintfImpl(charStr(a[1]), [v]));
    const r = v.dims[0], c = v.dims[1] || 0;
    if (v.data.length === 1) return str(num2strScalar(v.data[0], prec));
    if (v.dims.length > 2) throw E('Input to num2str must be 2-D.', 'num2str yalnızca skaler, vektör ya da 2 boyutlu matris alır.');
    const cells = []; let w = 0;
    for (let i = 0; i < v.data.length; i++) { const s = num2strScalar(v.data[i], prec); cells.push(s); if (s.length > w) w = s.length; }
    const rows = [];
    for (let i = 0; i < r; i++) { let t = ''; for (let j = 0; j < c; j++) t += (j ? '  ' : '') + padL(cells[i + j * r], w); rows.push(t); }
    if (r === 1) return str(rows[0].replace(/^\s+/, ''));
    const o = new Float64Array(r * rows[0].length);
    for (let i = 0; i < r; i++) for (let j = 0; j < rows[0].length; j++) o[i + j * r] = rows[i].charCodeAt(j);
    return new Val('char', [r, rows[0].length], o);
  };
  B.sprintf = function (I, a) { need('sprintf', a, 1, 99); if (a[0].cls !== 'char') throw E('Format must be a character vector.', 'sprintf\'in ilk argümanı tırnak içinde bir biçim metni olmalı: sprintf(\'%d\', x).'); return str(sprintfImpl(charStr(a[0]), a.slice(1))); };
  B.fprintf = function (I, a) { need('fprintf', a, 1, 99); if (a[0].cls !== 'char') throw E('Format must be a character vector.', 'fprintf\'in ilk argümanı tırnak içinde bir biçim metni olmalı: fprintf(\'%d\\n\', x).'); I.out += sprintfImpl(charStr(a[0]), a.slice(1)); return []; };
  B.clc = function (I) { I.out = ''; I.cleared = true; return []; };
  B.clear = B.clearvars = function (I, a) {
    const names = a.map(function (v) { return charStr(v); });
    if (!names.length || names.indexOf('all') >= 0) I.vars.clear();
    else names.forEach(function (nm) { I.vars.delete(nm); });
    return [];
  };
  B.close = function (I, a) {
    if (!a.length) { if (I.curFig) I.closeFig(I.curFig.no); return []; }
    if (a[0].cls === 'char') { if (charStr(a[0]) === 'all') { I.figs = []; I.curFig = null; } return []; }
    for (let i = 0; i < a[0].data.length; i++) I.closeFig(a[0].data[i]);
    return [];
  };
  B.format = B.axis = B.grid = B.colormap = B.drawnow = B.pause = B.legend = B.truesize = function () { return []; };
  B.hold = function (I, a) {
    const ax = I.curAxes();
    const s = a.length ? charStr(a[0]) : '';
    ax.hold = s === 'on' || s === 'all' ? true : s === 'off' ? false : !ax.hold;
    return [];
  };
  B.figure = function (I, a) {
    need('figure', a, 0, 1);
    if (a.length) {
      const no = a[0].cls === 'char' ? Number(charStr(a[0])) : scalarArg(a[0]);
      if (!(no >= 1) || no !== Math.floor(no)) throw E('Invalid figure number.', 'figure numarası pozitif bir tam sayı olmalı: figure(2) gibi.');
      I.curFig = I.figs.find(function (f) { return f.no === no; }) || I.newFig(no);
    } else I.newFig();
    return [];
  };
  B.subplot = function (I, a) {
    let r, c, i;
    if (a.length === 1 && a[0].data.length === 1 && a[0].data[0] >= 111 && a[0].data[0] <= 999) {
      const x = a[0].data[0]; r = Math.floor(x / 100); c = Math.floor(x / 10) % 10; i = x % 10;
    } else {
      need('subplot', a, 3, 3);
      r = scalarArg(a[0]); c = scalarArg(a[1]); i = scalarArg(a[2]);
    }
    if (!(r >= 1) || !(c >= 1) || r !== Math.floor(r) || c !== Math.floor(c)) throw E('Illegal plot number.', 'subplot(satır, sütun, sıra) için satır ve sütun pozitif tam sayı olmalı.');
    if (!(i >= 1) || i !== Math.floor(i) || i > r * c) throw E('Index exceeds number of subplots.', 'subplot(' + r + ',' + c + ',...) ' + (r * c) + ' hücrelik bir ızgara oluşturur; üçüncü sayı 1 ile ' + (r * c) + ' arasında olmalı. Hücreler soldan sağa, sonra yukarıdan aşağıya numaralanır.');
    const fig = I.fig();
    let ax = fig.axes.find(function (x) { return x.rows === r && x.cols === c && x.index === i; });
    if (!ax) {
      const rect = function (R, C, K) { const col = (K - 1) % C, row = Math.floor((K - 1) / C); return [col / C, row / R, (col + 1) / C, (row + 1) / R]; };
      const nr = rect(r, c, i), eps = 1e-9;
      fig.axes = fig.axes.filter(function (x) {
        const o = rect(x.rows, x.cols, x.index);
        return !(o[0] < nr[2] - eps && nr[0] < o[2] - eps && o[1] < nr[3] - eps && nr[1] < o[3] - eps);
      });
      ax = { rows: r, cols: c, index: i, type: 'empty' };
      fig.axes.push(ax);
    }
    fig.cur = ax;
    return [];
  };
  B.title = function (I, a) { need('title', a, 1, 99); I.curAxes().title = a[0].cls === 'char' ? charStr(a[0]) : num2strScalar(a[0].data[0]); return []; };
  B.xlabel = function (I, a) { need('xlabel', a, 1, 99); I.curAxes().xlabel = charStr(a[0]); return []; };
  B.ylabel = function (I, a) { need('ylabel', a, 1, 99); I.curAxes().ylabel = charStr(a[0]); return []; };
  B.imread = function (I, a) {
    need('imread', a, 1, 2);
    if (a[0].cls !== 'char') throw E('The file name or URL argument must be a character vector or string scalar.', 'imread\'e dosya adı tırnak içinde verilmeli: imread(\'cameraman.tif\').');
    if (USER_IMG) return new Val('uint8', [256, 256], USER_IMG.slice());
    const ad = charStr(a[0]).trim().toLowerCase().replace(/^.*[\\/]/, '').replace(/\.[a-z0-9]+$/, '');
    const kayit = NAMED_IMG[ad];
    if (kayit) return new Val('uint8', kayit.dims.slice(), kayit.data.slice());
    return new Val('uint8', [256, 256], makeImage().slice());
  };
  B.imnoise = function (I, a) {
    need('imnoise', a, 1, 4);
    const v = a[0];
    if (a.length < 2 || a[1].cls !== 'char') throw E("imnoise: noise type must be given, e.g. imnoise(I,'salt & pepper',0.02).", "imnoise'a gürültü türünü yazmalısın: imnoise(I, 'salt & pepper', 0.02).");
    const type = charStr(a[1]).toLowerCase().replace(/\s+/g, '');
    if (type !== 'salt&pepper') throw E("Unknown or unsupported noise type '" + charStr(a[1]) + "'.", "Bu ortamda yalnızca 'salt & pepper' (tuz-biber) gürültüsü destekleniyor. Yazımı kontrol et: 'salt & pepper'.");
    const dns = a.length > 2 ? scalarArg(a[2], 'density') : 0.05;
    if (!(dns >= 0 && dns <= 1)) throw E('Noise density must be between 0 and 1.', 'Gürültü yoğunluğu 0 ile 1 arasında olmalı (örn. 0.02 → piksellerin %2\'si).');
    const rng = mulberry32(20240229), o = v.data.slice(), hi = v.cls === 'uint8' ? 255 : 1;
    for (let i = 0; i < o.length; i++) { const x = rng(); if (x < dns / 2) o[i] = 0; else if (x < dns) o[i] = hi; }
    return new Val(v.cls === 'logical' ? 'double' : v.cls, v.dims.slice(), o);
  };
  B.im2double = function (I, a) { need('im2double', a, 1, 1); const v = a[0]; return v.cls === 'uint8' ? map1(v, function (x) { return x / 255; }, 'double') : toCls(v, 'double'); };
  B.im2uint8 = function (I, a) { need('im2uint8', a, 1, 1); const v = a[0]; return v.cls === 'uint8' ? v : map1(v, function (x) { return sat8(x * 255); }, 'uint8'); };
  B.rgb2gray = function (I, a) {
    need('rgb2gray', a, 1, 1); const v = a[0];
    if (v.dims.length !== 3 || v.dims[2] !== 3) throw E('MAP must be a m x 3 array, or RGB must be a m x n x 3 array.', 'rgb2gray renkli (satır × sütun × 3) bir görüntü ister. Bu görüntü zaten gri (2 boyutlu).');
    const n = v.dims[0] * v.dims[1], o = new Float64Array(n), d = v.data;
    for (let i = 0; i < n; i++) { const g = 0.2989 * d[i] + 0.5870 * d[i + n] + 0.1140 * d[i + 2 * n]; o[i] = v.cls === 'uint8' ? sat8(g) : g; }
    return new Val(v.cls, [v.dims[0], v.dims[1]], o);
  };
  B.imshow = function (I, a) {
    need('imshow', a, 1, 2);
    let v = a[0];
    if (v.cls === 'char') v = B.imread(I, [v]);
    const dm = v.dims, h = dm[0], w = dm[1], d = v.data;
    const rgb = dm.length === 3 && dm[2] === 3;
    if (d.length === 0 || (dm.length > 2 && !rgb)) throw E('Expected input number 1, I, to be a nonempty 2-D grayscale or M-by-N-by-3 RGB image.', 'imshow boş olmayan 2 boyutlu (gri) ya da satır×sütun×3 (renkli) bir matris ister. Gösterdiğin değişkenin boyutunu size(...) ile kontrol et.');
    let lo = 0, hi = v.cls === 'uint8' ? 255 : 1;
    if (a.length === 2) {
      const rg = a[1];
      if (rg.cls === 'char') throw E('Unsupported imshow option.', 'imshow\'un ikinci argümanı olarak yalnızca [] (otomatik ölçekleme) ya da [alt üst] aralığı destekleniyor.');
      if (rg.data.length === 0) {
        let mn = Infinity, mx = -Infinity;
        for (let i = 0; i < d.length; i++) { const x = d[i]; if (x < mn) mn = x; if (x > mx) mx = x; }
        if (mx > mn) { lo = mn; hi = mx; }
      } else if (rg.data.length === 2 && rg.data[1] > rg.data[0]) { lo = rg.data[0]; hi = rg.data[1]; }
      else throw E('Display range must be [] or a two-element vector [LOW HIGH] with HIGH > LOW.', 'imshow(X, [alt üst]) için iki sayı ver ve üst > alt olsun; otomatik ölçekleme için imshow(X, []) yaz.');
    }
    const sc = 255 / (hi - lo), n = h * w;
    const conv = function (x) { const g = Math.round((x - lo) * sc); return g !== g ? 0 : g < 0 ? 0 : g > 255 ? 255 : g; };
    const gray = new Array(n);
    const ax = I.curAxes();
    const keep = { rows: ax.rows, cols: ax.cols, index: ax.index };
    Object.keys(ax).forEach(function (k) { delete ax[k]; });
    ax.rows = keep.rows; ax.cols = keep.cols; ax.index = keep.index;
    ax.type = 'image'; ax.width = w; ax.height = h;
    if (rgb) {
      const out = new Array(n * 3);
      for (let i = 0; i < h; i++) for (let j = 0; j < w; j++) {
        const p = i + j * h, q = i * w + j;
        const R = conv(d[p]), G = conv(d[p + n]), Bl = conv(d[p + 2 * n]);
        out[q * 3] = R; out[q * 3 + 1] = G; out[q * 3 + 2] = Bl;
        gray[q] = Math.round(0.299 * R + 0.587 * G + 0.114 * Bl);
      }
      ax.rgb = out;
    } else {
      for (let i = 0; i < h; i++) { const ro = i * w; for (let j = 0; j < w; j++) gray[ro + j] = conv(d[i + j * h]); }
    }
    ax.gray = gray;
    return [];
  };
  B.plot = function (I, a) {
    need('plot', a, 1, 99);
    const nums = [];
    const groups = [];
    for (let i = 0; i < a.length; i++) {
      if (a[i].cls === 'char') { if (nums.length) { groups.push(nums.splice(0)); } if (i + 1 < a.length && a[i + 1].cls !== 'char' && /^(linewidth|markersize|color|linestyle|marker)$/i.test(charStr(a[i]))) i++; continue; }
      nums.push(a[i]);
      if (nums.length === 2) groups.push(nums.splice(0));
    }
    if (nums.length) groups.push(nums.splice(0));
    const series = [];
    const cols = function (v) {
      if (v.dims.length > 2) throw E('Data cannot have more than 2 dimensions.', 'plot yalnızca vektör ya da 2 boyutlu matris çizer.');
      const r = v.dims[0], c = v.dims[1];
      if (r === 1 || c === 1) return [Array.from(v.data)];
      const out = [];
      for (let j = 0; j < c; j++) out.push(Array.from(v.data.subarray(j * r, (j + 1) * r)));
      return out;
    };
    groups.forEach(function (g) {
      if (g.length === 1) {
        cols(g[0]).forEach(function (y) { series.push({ x: y.map(function (_, i) { return i + 1; }), y: y }); });
      } else {
        const xs = cols(g[0]), ys = cols(g[1]);
        ys.forEach(function (y, q) {
          const x = xs.length === 1 ? xs[0] : xs[q] || xs[0];
          if (x.length !== y.length) throw E('Vectors must be the same length.', 'plot(x, y) için x ve y aynı uzunlukta olmalı: x ' + x.length + ' elemanlı, y ' + y.length + ' elemanlı.');
          series.push({ x: x, y: y });
        });
      }
    });
    const ax = I.curAxes();
    if (ax.type !== 'plot' || !ax.hold) {
      const keep = { rows: ax.rows, cols: ax.cols, index: ax.index, hold: ax.hold };
      Object.keys(ax).forEach(function (k) { delete ax[k]; });
      ax.rows = keep.rows; ax.cols = keep.cols; ax.index = keep.index; if (keep.hold) ax.hold = true;
      ax.type = 'plot'; ax.series = [];
    }
    ax.series = ax.series.concat(series);
    return [];
  };

  const FN_NAMES = Object.keys(B);
  function undefinedErr(name, I) {
    const low = name.toLowerCase();
    let tr = '';
    for (const k of I.vars.keys()) if (k !== name && k.toLowerCase() === low) { tr = 'MATLAB büyük-küçük harfe duyarlıdır: "' + k + '" tanımlı ama sen "' + name + '" yazdın. Bunlar iki ayrı addır.'; break; }
    if (!tr) { const f = FN_NAMES.find(function (k) { return k.toLowerCase() === low; }); if (f) tr = 'MATLAB büyük-küçük harfe duyarlıdır: fonksiyonun adı "' + f + '", "' + name + '" değil.'; }
    if (!tr) tr = '"' + name + '" adında bir değişken ya da fonksiyon yok. Yazım hatası olabilir; ya da değişkeni tanımlamadan (veya clear ile sildikten sonra) kullanıyorsun. Önce ' + name + ' = ... ile değer ata.';
    return E("Unrecognized function or variable '" + name + "'.", tr);
  }

  // ---------------------------------------------------------------- yorumlayıcı
  class MiniMatlab {
    constructor(opts) {
      this.maxSteps = (opts && opts.maxSteps) || 20e6;
      this.reset();
    }
    reset() {
      this.vars = new Map();
      this.figs = [];
      this.curFig = null;
      this.rng = mulberry32(42);
      this.out = '';
      this.cleared = false;
      this.steps = 0;
      this.line = 0;
      this.endStack = [];
    }
    run(code) {
      this.out = ''; this.cleared = false; this.steps = 0; this.line = 0; this.endStack = [];
      let error = null;
      try {
        const prog = parse(String(code == null ? '' : code).replace(/\r\n?/g, '\n'));
        this.execBlock(prog);
      } catch (e) {
        if (e instanceof MError) {
          error = { message: e.message, line: e.line || this.line || 1, mesajTr: e.tr || ('Kodda bir hata var: ' + e.message) };
        } else if (e instanceof RangeError) {
          error = { message: 'Out of memory or expression too deeply nested.', line: this.line || 1, mesajTr: 'Bellek yetmedi ya da ifade çok derin iç içe. Çok büyük bir matris oluşturuyor olabilirsin; boyutları kontrol et.' };
        } else {
          error = { message: 'Internal interpreter error: ' + (e && e.message ? e.message : String(e)), line: this.line || 1, mesajTr: 'Yorumlayıcıda beklenmeyen bir iç hata oluştu. Kodu sadeleştirip yeniden dene.' };
        }
      }
      return { output: this.out, error: error, vars: this.snapshotVars(), figures: this.snapshotFigures(), cleared: this.cleared };
    }
    snapshotVars() {
      const o = {};
      for (const [k, v] of this.vars) o[k] = snapshot(v);
      return o;
    }
    snapshotFigures() {
      return this.figs.slice().sort(function (a, b) { return a.no - b.no; }).map(function (f) {
        return {
          no: f.no,
          axes: f.axes.map(function (ax) {
            const o = {};
            for (const k in ax) if (k !== 'hold') o[k] = ax[k];
            if (o.series) o.series = o.series.map(function (s) { return { x: s.x.slice(), y: s.y.slice() }; });
            return o;
          })
        };
      });
    }
    // --- figürler
    newFig(no) {
      if (!no) { no = 1; const used = new Set(this.figs.map(function (f) { return f.no; })); while (used.has(no)) no++; }
      const f = { no: no, axes: [], cur: null };
      this.figs.push(f); this.curFig = f;
      return f;
    }
    fig() { return this.curFig || this.newFig(); }
    closeFig(no) {
      this.figs = this.figs.filter(function (f) { return f.no !== no; });
      if (this.curFig && this.curFig.no === no) this.curFig = this.figs.length ? this.figs[this.figs.length - 1] : null;
    }
    curAxes() {
      const f = this.fig();
      if (!f.cur) { f.cur = { rows: 1, cols: 1, index: 1, type: 'empty' }; f.axes.push(f.cur); }
      return f.cur;
    }
    // --- değişkenler
    setVar(name, v) {
      if (v.owned) v = clone(v);
      v.owned = true;
      this.vars.set(name, v);
    }
    show(name) { this.out += formatNamed(name, this.vars.get(name)); }
    call(name, args, nout) {
      const f = B[name];
      if (!f) throw undefinedErr(name, this);
      const r = f(this, args, nout);
      if (r === undefined) return [];
      return r instanceof Val ? [r] : r;
    }
    evArgs(nodes, name) {
      const out = new Array(nodes.length);
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        if (a.type === 'Colon') {
          if (!B[name]) throw undefinedErr(name, this);
          throw E('A colon (:) alone is only valid when indexing a variable.', '":" tek başına yalnızca bir değişkeni indekslerken kullanılır (A(:,1) gibi). "' + name + '" bir fonksiyon; ona argüman olarak verilemez.');
        }
        out[i] = this.ev(a);
      }
      return out;
    }
    evSubs(A, node) {
      const an = node.args, k = an.length, flags = node.endFlags, subs = new Array(k);
      for (let i = 0; i < k; i++) {
        const a = an[i];
        if (a.type === 'Colon') subs[i] = COLON;
        else if (flags && flags[i]) {
          this.endStack.push({ A: A, i: i, k: k });
          subs[i] = this.ev(a);
          this.endStack.pop();
        } else subs[i] = this.ev(a);
      }
      return subs;
    }
    ev(n) {
      if (++this.steps > this.maxSteps) throw E(MSG.STEPS, TR.STEPS);
      switch (n.type) {
        case 'Num': case 'Str': return n.val;
        case 'Ident': {
          const v = this.vars.get(n.name);
          if (v !== undefined) return v;
          const r = this.call(n.name, [], 1);
          if (!r.length) throw E('Error using ' + n.name + '\nToo many output arguments.', '"' + n.name + '" bir değer döndürmez; bu yüzden bir ifadenin içinde ya da atamanın sağında kullanılamaz. Tek başına bir komut olarak yaz.');
          return r[0];
        }
        case 'Index': {
          const A = this.vars.get(n.name);
          if (A === undefined) {
            const r = this.call(n.name, this.evArgs(n.args, n.name), 1);
            if (!r.length) throw E('Error using ' + n.name + '\nToo many output arguments.', '"' + n.name + '" bir değer döndürmez; bu yüzden bir ifadenin içinde ya da atamanın sağında kullanılamaz. Tek başına bir komut olarak yaz.');
            return r[0];
          }
          if (n.args.length === 0) return A;
          return indexRead(A, this.evSubs(A, n));
        }
        case 'Bin': {
          const op = n.op;
          if (op === '&&' || op === '||') {
            const l = this.ev(n.l);
            if (l.data.length !== 1) throw this.scErr(op);
            const lv = l.data[0] !== 0;
            if (op === '&&' ? !lv : lv) return bool(lv);
            const r = this.ev(n.r);
            if (r.data.length !== 1) throw this.scErr(op);
            return bool(r.data[0] !== 0);
          }
          const l = this.ev(n.l), r = this.ev(n.r);
          return binop(op, l, r);
        }
        case 'Un': return unop(n.op, this.ev(n.e));
        case 'Paren': return this.ev(n.e);
        case 'Range': {
          const a = this.ev(n.a), s = n.s ? this.ev(n.s) : null, b = this.ev(n.b);
          if (!a.data.length || !b.data.length || (s && !s.data.length)) return new Val('double', [1, 0], new Float64Array(0));
          const r = rangeVal(a.data[0], s ? s.data[0] : 1, b.data[0]);
          if (a.cls === 'uint8' || b.cls === 'uint8' || (s && s.cls === 'uint8')) return toCls(r, 'uint8');
          return r;
        }
        case 'Mat': {
          const rows = n.rows;
          if (!rows.length) return empty();
          if (rows.length === 1) return this.evRow(rows[0]);
          const rs = new Array(rows.length);
          for (let i = 0; i < rows.length; i++) rs[i] = this.evRow(rows[i]);
          return concat(rs, false);
        }
        case 'End': {
          const c = this.endStack[this.endStack.length - 1];
          if (!c) throw E('The end operator must be used within an array index expression.', '"end" bir değer olarak yalnızca bir değişkenin indeksi içinde kullanılabilir: v(end), A(end,1) gibi.');
          const d = c.A.dims;
          if (c.k === 1) return num(c.A.data.length);
          if (c.i < c.k - 1) return num(c.i < d.length ? d[c.i] : 1);
          let p = 1; for (let j = c.i; j < d.length; j++) p *= d[j];
          return num(p);
        }
        case 'Colon':
          throw E(MSG.GENERIC, '":" tek başına yalnızca indeks içinde kullanılabilir: A(:,1) gibi.');
      }
      throw E('Internal: unknown node ' + n.type);
    }
    scErr(op) {
      return E('Operands to the logical AND (&&) and OR (||) operators must be convertible to logical scalar values. Use the ANY or ALL functions to reduce operands to logical scalar values.',
        '"' + op + '" yalnızca tek değerli (skaler) koşullarla çalışır. Matrisleri eleman eleman karşılaştırmak için tek "' + op[0] + '" kullan; ya da any(...) / all(...) ile tek değere indir.');
    }
    evRow(row) {
      const k = row.length;
      if (k === 1) {
        const v = this.ev(row[0]);
        return v;
      }
      const vs = new Array(k);
      let allScalarDouble = true;
      for (let i = 0; i < k; i++) { const v = this.ev(row[i]); vs[i] = v; if (v.data.length !== 1 || v.cls !== 'double') allScalarDouble = false; }
      if (allScalarDouble) {
        const o = new Float64Array(k);
        for (let i = 0; i < k; i++) o[i] = vs[i].data[0];
        return new Val('double', [1, k], o);
      }
      return concat(vs, true);
    }
    // --- komutlar
    execBlock(stmts) {
      for (let i = 0; i < stmts.length; i++) {
        const r = this.exec(stmts[i]);
        if (r) return r;
      }
      return 0;
    }
    assignTo(name, argNode, rhs) {
      if (!argNode) { this.setVar(name, rhs); return; }
      const A = this.vars.get(name);
      const ctxA = A || empty();
      const subs = this.evSubs(ctxA, argNode);
      const R = indexAssign(A, subs, rhs);
      if (R !== A) { R.owned = true; this.vars.set(name, R); }
    }
    exec(s) {
      this.line = s.line;
      if (++this.steps > this.maxSteps) throw E(MSG.STEPS, TR.STEPS);
      switch (s.type) {
        case 'Expr': {
          const e = s.e;
          if (e.type === 'Ident' && this.vars.has(e.name)) { if (!s.sup) this.show(e.name); return 0; }
          let v;
          if ((e.type === 'Ident' || e.type === 'Index') && !this.vars.has(e.name)) {
            const r = this.call(e.name, e.type === 'Index' ? this.evArgs(e.args, e.name) : [], 0);
            if (!r.length) return 0;
            v = r[0];
          } else v = this.ev(e);
          this.setVar('ans', v);
          if (!s.sup) this.show('ans');
          return 0;
        }
        case 'Assign': {
          const t = s.target;
          const rhs = this.ev(s.rhs);
          this.assignTo(t.name, t.type === 'Index' ? t : null, rhs);
          if (!s.sup) this.show(t.name);
          return 0;
        }
        case 'Multi': {
          const e = s.rhs, nout = s.targets.length;
          let res;
          if ((e.type === 'Ident' || e.type === 'Index') && !this.vars.has(e.name)) {
            res = this.call(e.name, e.type === 'Index' ? this.evArgs(e.args, e.name) : [], nout);
          } else res = [this.ev(e)];
          if (res.length < nout) {
            throw E('Too many output arguments.', 'Sol tarafta ' + nout + ' çıktı istiyorsun ama sağ taraf bu kadar değer döndürmüyor. [a, b] = ... biçimi yalnızca çok çıktılı fonksiyonlarla kullanılır: [w, h] = size(A), [m, i] = max(v) gibi.');
          }
          for (let i = 0; i < nout; i++) {
            const t = s.targets[i];
            if (!t) continue;
            this.assignTo(t.name, t.args ? t : null, res[i]);
          }
          if (!s.sup) for (let i = 0; i < nout; i++) if (s.targets[i]) this.show(s.targets[i].name);
          return 0;
        }
        case 'If': {
          const cl = s.clauses;
          for (let i = 0; i < cl.length; i++) {
            this.line = cl[i].line;
            if (truthy(this.ev(cl[i].cond))) return this.execBlock(cl[i].body);
          }
          return s.elseBody ? this.execBlock(s.elseBody) : 0;
        }
        case 'For': {
          const e = s.e, body = s.body, name = s.name;
          if (e.type === 'Range') {
            const av = this.ev(e.a), sv = e.s ? this.ev(e.s) : null, bv = this.ev(e.b);
            if (!av.data.length || !bv.data.length || (sv && !sv.data.length)) { this.setVar(name, new Val('double', [1, 0], new Float64Array(0))); return 0; }
            const a = av.data[0], st = sv ? sv.data[0] : 1, b = bv.data[0];
            const u8 = av.cls === 'uint8' || bv.cls === 'uint8' || (sv && sv.cls === 'uint8');
            if (!(st !== 0) || st !== st || a !== a || b !== b || (st > 0 && a > b) || (st < 0 && a < b)) { this.setVar(name, new Val('double', [1, 0], new Float64Array(0))); return 0; }
            const n = Math.floor((b - a) / st + 1e-10) + 1;
            for (let i = 0; i < n; i++) {
              const v = num(a + i * st);
              if (u8) { v.cls = 'uint8'; v.data[0] = sat8(v.data[0]); }
              v.owned = true;
              this.vars.set(name, v);
              const r = this.execBlock(body);
              if (r === 1) break;
              if (r === 3) return 3;
              this.line = s.line;
              if (++this.steps > this.maxSteps) throw E(MSG.STEPS, TR.STEPS);
            }
            return 0;
          }
          let v = this.ev(e);
          if (v.owned) v = clone(v);
          const rows = v.dims[0], n = v.data.length, cols = rows ? n / rows : 0;
          if (cols === 0) { this.setVar(name, new Val(v.cls, [rows, 0], new Float64Array(0))); return 0; }
          for (let j = 0; j < cols; j++) {
            const it = new Val(v.cls, [rows, 1], v.data.slice(j * rows, (j + 1) * rows));
            it.owned = true;
            this.vars.set(name, it);
            const r = this.execBlock(body);
            if (r === 1) break;
            if (r === 3) return 3;
            this.line = s.line;
            if (++this.steps > this.maxSteps) throw E(MSG.STEPS, TR.STEPS);
          }
          return 0;
        }
        case 'While': {
          for (;;) {
            this.line = s.line;
            if (!truthy(this.ev(s.cond))) return 0;
            const r = this.execBlock(s.body);
            if (r === 1) return 0;
            if (r === 3) return 3;
          }
        }
        case 'Break': return 1;
        case 'Continue': return 2;
        case 'Return': return 3;
        case 'Cmd': {
          this.call(s.name, s.args.map(str), 0);
          return 0;
        }
      }
      return 0;
    }
  }

  MiniMatlab.format = function (snap, name) {
    const v = fromSnapshot(snap);
    return name ? formatNamed(String(name), v, true) : bodyText(v, false, true);
  };
  /* 256×256, satır-öncelikli, 0-255 gri değer dizisi verilir; null verilirse sentetik resme dönülür. */
  /* Ada göre resim kaydı: data satır-öncelikli, kanal 1 (gri) ya da 3 (RGB, pikseller art arda). */
  MiniMatlab.registerImage = function (ad, h, w, kanal, data) {
    const d = new Float64Array(h * w * kanal);
    for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) for (let k = 0; k < kanal; k++) d[k * h * w + c * h + r] = data[(r * w + c) * kanal + k];
    NAMED_IMG[String(ad).toLowerCase()] = { dims: kanal === 1 ? [h, w] : [h, w, kanal], data: d };
  };
  MiniMatlab.imageNames = function () { return Object.keys(NAMED_IMG); };
  MiniMatlab.setUserImage = function (gray) {
    if (!gray) { USER_IMG = null; return; }
    if (gray.length !== 256 * 256) throw new Error('setUserImage: 256x256 gri dizi bekleniyor');
    const d = new Float64Array(256 * 256);
    for (let r = 0; r < 256; r++) for (let c = 0; c < 256; c++) d[c * 256 + r] = Math.max(0, Math.min(255, Math.round(gray[r * 256 + c])));
    USER_IMG = d;
  };
  MiniMatlab.hasUserImage = function () { return !!USER_IMG; };
  MiniMatlab.SUPPORTED = FN_NAMES.slice().sort();
  MiniMatlab.KEYWORDS = ['if', 'elseif', 'else', 'end', 'for', 'while', 'break', 'continue', 'return'];
  MiniMatlab.version = '1.0.0';
  return MiniMatlab;
});
