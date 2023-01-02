/**
 * Letter parser: recursive descent implementation.
 */

const { Tokenizer } = require("./Tokenizer");

class Parser {
  constructor() {
    this._string = "";
    this._tokenizer = new Tokenizer();
  }
  /**
   * Parses a string into an AST. Abstract Syntax Tree
   */
  parse(string) {
    this._string = string;
    this._tokenizer.init(string);

    // predictive parser
    // Prime the tokenizer to obtain the first toekn
    // which is our lookahead. The lookahead is used
    // for predictive parsing.

    this._lookahead = this._tokenizer.getNexToken();

    // Parse recursively starting from the main
    // entry point, the Program:
    return this.Program();
  }

  /**
   * Main entry point
   * Program
   * 	: NumericLiteral
   * 	;
   */
  Program() {
    return { type: "Program", body: this.Literal() };
  }

  /**
   * Literal
   * 	: NumericLiteral
   * 	| StringLiteral
   * 	;
   */
  Literal() {
    switch (this._lookahead.type) {
      case "NUMBER":
        return this.NumericLiteral();
      case "STRING":
        return this.StringLiteral();
    }
		throw new SyntaxError(`Literal: unexpected literal production`);
  }

	StringLiteral() {
		const token = this._expectsToken("STRING");
		return {
			type: 'StringLiteral',
			value: token.value.slice(1, -1)
		};
	}

  /**
   * NumericLiteral
   * 	: NUMBER
   * 	;
   */
  NumericLiteral() {
    const token = this._expectsToken("NUMBER");
    return {
      type: "NumericLiteral",
      value: Number(token.value),
    };
  }

  /**
   * Expects a token of a given type
   */
  _expectsToken(tokenType) {
    const token = this._lookahead;

    if (token == null) {
      throw new SyntaxError(`Unexpected end of input, expected: ${tokenType}`);
    }

    if (token.type !== tokenType) {
      throw new SyntaxError(
        `Unexpected token: "${token.value}", expected: "${tokenType}"`
      );
    }

    this._lookahead = this._tokenizer.getNexToken();

    return token;
  }
}

module.exports = {
  Parser,
};
