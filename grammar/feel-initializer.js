/*
 *
 *  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 *  Bangalore, India. All Rights Reserved.
 *
 */
// initializer section start

// ast nodes are the constructors used to construct the ast for the parsed grammar
const ast = require('./feel-ast');

// adding build methods to prototype of each constructor
require('./feel-ast-parser')(ast);

function extractOptional(optional, index) {
  return optional ? optional[index] : null;
}

function flatten(list) {
  return list.filter( d => d && d.length).reduce((recur, next) => {
    if(next && Array.isArray(next)) {
      return [].concat.call(recur, flatten(next));
    }
    return [].concat.call(recur, next);
  }, []);
}

function extractList(list, index) {
  return list.map(element => element[index]);
}

function buildList(head, tail, index) {
  return [head].concat(extractList(tail, index));
}

function buildName(head, tail, index) {
  return tail && tail.length ? [...head, ...flatten(tail)].join("") : head.join("");
}


function buildBinaryExpression(head, tail, loc) {
  return tail.reduce((result, element) => new ast.ArithmeticExpressionNode(element[1], result, element[3], loc), head);
}

function buildComparisionExpression(head, tail, loc) {
  return tail.reduce((result, element) => {
    const operator = Array.isArray(element[1]) ? element[1][0] : element[1];
    return new ast.ComparisionExpressionNode(operator, result, element[3], null, loc);
  }, head);
}

function buildLogicalExpression(head, tail, loc) {
  return tail.reduce((result, element) => {
    let operator = element[1];
    if (operator === 'and') {
      operator = '&&';
    } else if (operator === 'or') {
      operator = '||';
    }
    return new ast.LogicalExpressionNode(operator, result, element[3], loc);
  }, head);
}

