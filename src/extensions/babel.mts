import { Node } from "@babel/core";
import { FunctionExpression } from "@babel/types";
import * as esTree from "estree-walker";
import babelGenerator from "@babel/generator";
import babelParse from "@babel/parser";

// ----------------------------------------------
export default () => ({
  babel: { astToCode, codeToAst, walk, findNode },
});
// ----------------------------------------------
const { walk: babelWalk } = esTree;

// ----------------------------------------------
const ast = babelParse.parse("var name;", {
  sourceType: "module",
});

const astToCode = (
  node,
  isMinified = false
): ReturnType<typeof babelGenerator> => {
  ast.program.body = (Array.isArray(node) ? node : [node]) as any;
  return babelGenerator(ast, { minified: isMinified }) as any;
};
const codeToAst = (code: string) => {
  const ast = babelParse.parse(`function t(){${code}}`);
  return (ast.program.body[0] as any as FunctionExpression).body.body;
};
const walk = babelWalk as any as (
  node: any,
  walker: { enter?: NewSyncHandler; leave?: NewSyncHandler }
) => Node | null;

const findNode = <T,>(
  callback: (done: (value: T) => void) => any,
  fail: any
) => {
  let result = undefined as T;
  const errDone = {};
  const done = (val) => {
    result = val;
    throw errDone;
  };

  try {
    callback(done);
  } catch (error) {
    if (error === errDone) return result;
    throw fail;
  }
  return result;
};
// ----------------------------------------------
type NewSyncHandler = (
  this: { skip: Function; remove: Function; replace: Function },
  node: Node
) => void;
