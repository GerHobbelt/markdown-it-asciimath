/*! markdown-it-asciimath 1.0.0-2 https://github.com//GerHobbelt/markdown-it-asciimath @license MIT */

let katex = require('katex');

let assign = require('lodash.assign');

let defaults = {
  useKeyword: false
};
let options;

function setup(md, o) {
  // use defaults if no options set
  options = o;

  if (typeof options.useKeyword === 'undefined') {
    options.useKeyword = defaults.useKeyword;
  }

  let useKeyword = options.useKeyword;
  let defaultRender = md.renderer.rules.fence;

  md.renderer.rules.fence = function (tokens, idx, options, env, self) {
    let token = tokens[idx];

    if (token.info === 'math') {
      return render(token.content, true);
    }

    if (token.info === 'latex') {
      return renderTeX(token.content, true);
    } // pass token to default renderer.


    return defaultRender(tokens, idx, options, env, self);
  };

  md.renderer.rules.code_inline = function (tokens, idx, options, env, self) {
    let token = tokens[idx];

    if (!useKeyword) {
      return renderInline(token.content.trim(), false);
    }

    if (token.content.substr(0, 4) === 'math') {
      return renderInline(token.content.substr(4).trim(), false);
    } else if (token.content.substr(0, 5) === 'latex') {
      return renderElement(token.content.substr(5).trim(), false);
    }

    return defaultRender(tokens, idx, options, env, self);
  };
}

function render(str, disp) {
  // split content
  let arr = str.trim().split('\n\n');
  let result = '';

  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      result += '<p>' + renderElement(preprocessMath(arr[i]), disp) + '<p>';
    }
  }

  return result;
}

function renderTeX(str, disp) {
  // split content
  let arr = str.trim().split('\n');
  let result = ''; // render each line, skipping empty lines

  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      result += '<p>' + renderElement(arr[i], disp) + '<p>';
    }
  }

  return result;
}

function renderInline(str, disp) {
  return renderElement(preprocessMath(str), disp);
}

function renderElement(str, disp) {
  return katex.renderToString(str, {
    displayMode: disp
  });
}

function preprocessMath(str) {
  // parse to TeX
  let newstr = AMTparseAMtoTeX(str);
  return newstr;
}

module.exports = setup;
//# sourceMappingURL=markdownItAsciiMath.modern.js.map
