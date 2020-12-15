const assert = require( 'assert');
const { join } = require( 'path');
const { addSideEffect, addDefault, addNamed, addNamespace } = require( '@babel/helper-module-imports');


let step = 0;


class Plugin {
  constructor(
    sourcePathName,
    types,
    index = 0,
  ) {
    this.sourcePathName = sourcePathName;
    this.types = types;
    this.pluginStateKey = `importPluginState${index}`;
  }

  getPluginState(state) {
    if (!state[this.pluginStateKey]) {
      state[this.pluginStateKey] = {}; 
    }
    return state[this.pluginStateKey];
  }

  importMethod(methodName, file, pluginState) {
    console.log( step++,'importMethod', methodName );

    if (!pluginState.selectedMethods[methodName]) {
      
      const path = this.sourcePathName.split('/')[0];

      // pluginState.selectedMethods[methodName] = addDefault(file.path, path, { nameHint: methodName });
      pluginState.selectedMethods[methodName] = addNamed(file.path, methodName, path);
     
    }
    return { ...pluginState.selectedMethods[methodName] };
  }

  buildExpressionHandler(node, props, path, state) {
    const file = (path && path.hub && path.hub.file) || (state && state.file);
    const { types } = this;
    const pluginState = this.getPluginState(state);
    props.forEach(prop => {
      if (!types.isIdentifier(node[prop])) return;
      if (
        pluginState.specified[node[prop].name] &&
        types.isImportDefaultSpecifier(path.scope.getBinding(node[prop].name).path)
      ) {
        console.log('this.importMethod call: buildExpressionHandler');
        node[prop] = this.importMethod(pluginState.specified[node[prop].name], file, pluginState); 
      }
    });
  }

  buildDeclaratorHandler(node, prop, path, state) {
    console.log( step++,'buildDeclaratorHandler');
    const file = (path && path.hub && path.hub.file) || (state && state.file);
    const { types } = this;
    const pluginState = this.getPluginState(state);
    if (!types.isIdentifier(node[prop])) return;
    if (
      pluginState.specified[node[prop].name] &&
      path.scope.hasBinding(node[prop].name) &&
      path.scope.getBinding(node[prop].name).path.type === 'ImportDefaultSpecifier'
    ) {
        console.log('this.importMethod call buildDeclaratorHandler');
      node[prop] = this.importMethod(pluginState.specified[node[prop].name], file, pluginState); 
    }
  }

  ProgramEnter(path, state) {
    console.log( step++, 'ProgramEnter');
    const pluginState = this.getPluginState(state);
    pluginState.specified = Object.create(null);
    pluginState.selectedMethods = Object.create(null);
    pluginState.pathsToRemove = [];
  }

  ProgramExit(path, state) {
    console.log( step++,'ProgramExit');
    this.getPluginState(state).pathsToRemove.forEach(p => !p.removed && p.remove());
  }

  ImportDeclaration(path, state) {
    console.log( step++,'ImportDeclaration');

    const { node } = path;

    // path maybe removed by prev instances.
    if (!node) return;

    const { value } = node.source;
    const { sourcePathName } = this;
    const { types } = this;
    const pluginState = this.getPluginState(state);

    console.log(value);

    if (value === sourcePathName) {
        // TODO: convert sourcePathName 
      node.specifiers.forEach(spec => {
        pluginState.specified[spec.local.name] = spec.local.name;

      });
      pluginState.pathsToRemove.push(path);
    }
  }

  CallExpression(path, state) {

    console.log( step++, 'CallExpression');
    
    const { node } = path;
    const file = (path && path.hub && path.hub.file) || (state && state.file);
    const { name } = node.callee;
    const { types } = this;
    const pluginState = this.getPluginState(state);

    if (types.isIdentifier(node.callee)) {
        console.log( step++, 'CallExpression', 'types.isIdentifier', name);
      if (pluginState.specified[name]) {
        console.log('this.importMethod call CallExpression', '1');
        node.callee = this.importMethod(pluginState.specified[name], file, pluginState);
      }
    }

    node.arguments = node.arguments.map(arg => {
      const { name: argName } = arg;
      if (
        pluginState.specified[argName] &&
        path.scope.hasBinding(argName) &&
        path.scope.getBinding(argName).path.type === 'ImportDefaultSpecifier'
      ) {
        console.log(path.scope.getBinding(argName).path.type);
        console.log('this.importMethod call CallExpression', '2');
        return this.importMethod(pluginState.specified[argName], file, pluginState);
      }
      return arg;
    });
  }

  MemberExpression(path, state) {
    const { node } = path;
    const file = (path && path.hub && path.hub.file) || (state && state.file);
    const pluginState = this.getPluginState(state);

    // multiple instance check.
    if (!node.object || !node.object.name) return;

    if (pluginState.specified[node.object.name] && path.scope.hasBinding(node.object.name)) {
      const { scope } = path.scope.getBinding(node.object.name);
      // global variable in file scope
      if (scope.path.parent.type === 'File') {
        console.log('this.importMethod call MemberExpression', '2');
        node.object = this.importMethod(pluginState.specified[node.object.name], file, pluginState);
      }
    }
  }

  Property(path, state) {
    const { node } = path;
    this.buildDeclaratorHandler(node, 'value', path, state);
  }

  VariableDeclarator(path, state) {
    const { node } = path;
    this.buildDeclaratorHandler(node, 'init', path, state);
  }

  ArrayExpression(path, state) {
    const { node } = path;
    const props = node.elements.map((_, index) => index);
    this.buildExpressionHandler(node.elements, props, path, state);
  }

  LogicalExpression(path, state) {
    const { node } = path;
    this.buildExpressionHandler(node, ['left', 'right'], path, state);
  }

  ConditionalExpression(path, state) {
    const { node } = path;
    this.buildExpressionHandler(node, ['test', 'consequent', 'alternate'], path, state);
  }

  IfStatement(path, state) {
    const { node } = path;
    this.buildExpressionHandler(node, ['test'], path, state);
    this.buildExpressionHandler(node.test, ['left', 'right'], path, state);
  }

  ExpressionStatement(path, state) {
    const { node } = path;
    const { types } = this;
    if (types.isAssignmentExpression(node.expression)) {
      this.buildExpressionHandler(node.expression, ['right'], path, state);
    }
  }

  ReturnStatement(path, state) {
    const { node } = path;
    this.buildExpressionHandler(node, ['argument'], path, state);
  }

  ExportDefaultDeclaration(path, state) {
    const { node } = path;
    this.buildExpressionHandler(node, ['declaration'], path, state);
  }

  BinaryExpression(path, state) {
    const { node } = path;
    this.buildExpressionHandler(node, ['left', 'right'], path, state);
  }

  NewExpression(path, state) {
    const { node } = path;
    this.buildExpressionHandler(node, ['callee', 'arguments'], path, state);
  }

  SwitchStatement(path, state) {
    const { node } = path;
    this.buildExpressionHandler(node, ['discriminant'], path, state);
  }

  SwitchCase(path, state) {
    const { node } = path;
    this.buildExpressionHandler(node, ['test'], path, state);
  }

  ClassDeclaration(path, state) {
    const { node } = path;
    this.buildExpressionHandler(node, ['superClass'], path, state);
  }
}






module.exports = function ({ types }) {
  let plugins = null;

  // Only for test
  // eslint-disable-next-line no-underscore-dangle
  global.__clearBabelAntdPlugin = () => {
    plugins = null;
  };

  function applyInstance(method, args, context) {
    // eslint-disable-next-line no-restricted-syntax
    for (const plugin of plugins) {
      if (plugin[method]) {
        plugin[method].apply(plugin, [...args, context]);
      }
    }
  }

  const Program = {
    enter(path, { opts = {} }) {
      // Init plugin instances once.
      if (!plugins) {
        
          assert(opts.sourcePathName, 'sourcePathName should be provided');
          plugins = [
            new Plugin(
              opts.sourcePathName,
              types,
            ),
          ];
        
      }
      applyInstance('ProgramEnter', arguments, this); 
    },
    exit() {
      applyInstance('ProgramExit', arguments, this); 
    },
  };

  const methods = [
    'ImportDeclaration',
    'CallExpression',
    'MemberExpression',
    'Property',
    'VariableDeclarator',
    'ArrayExpression',
    'LogicalExpression',
    'ConditionalExpression',
    'IfStatement',
    'ExpressionStatement',
    'ReturnStatement',
    'ExportDefaultDeclaration',
    'BinaryExpression',
    'NewExpression',
    'ClassDeclaration',
    'SwitchStatement',
    'SwitchCase',
  ];

  const ret = {
    visitor: { Program },
  };

  // eslint-disable-next-line no-restricted-syntax
  for (const method of methods) {
    ret.visitor[method] = function () {
      applyInstance(method, arguments, ret.visitor); 
    };
  }

  return ret;
}
