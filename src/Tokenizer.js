/**
 * Tokenizer class
 *
 * Lazily pulls a token from a stream.
 */
class Tokenizer {
  init(string) {
    this._string = string;
    this._cursor = 0;
  }

  hasMoreTokens() {
    return this._cursor < this._string.length;
  }

  getNexToken() {
    if (!this.hasMoreTokens()) {
      return null;
    }

    const string = this._string.slice(this._cursor);

    let nexToken = {};

    // Numbers:
    if (this.isANumber(string[0])) {
      let number = "";
      while (this.isANumber(string[this._cursor])) {
        number += string[this._cursor++];
      }

      nexToken = {
        type: "NUMBER",
        value: number,
      };
    }

    // String:

    if (string[0] === '"' || string[0] === "'") {
      let stringToken = "";
      do {
        stringToken += string[this._cursor++];
      } while (
        string[this._cursor] !== '"' &&
        string[this._cursor] !== "'" &&
        !this.isEOF()
      );
      stringToken += string[this._cursor];

    	nexToken = {
        type: "STRING",
        value: stringToken,
      };
    }

    return nexToken;
  }

  isEOF() {
    return this._cursor === this._string.length;
  }

  isANumber(value) {
    return !Number.isNaN(Number(value));
  }
}

module.exports = {
  Tokenizer,
};
