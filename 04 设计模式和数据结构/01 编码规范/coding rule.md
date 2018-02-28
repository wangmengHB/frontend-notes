
# 1. 除了构造函数(等价于class)以外，所有函数首字母小写
# 2. 构造函数首字母大写
# 3. 变量采用驼峰命名规则
my_variable: 这种命名规则适用于Python，在js种驼峰命名规则优先级更高.
# 4. 禁止全局变量
遇到解决历史遗留问题而不得不使用全局变量的情况，必需显示声明全局变量：
```js
window.globalVariable = xxx
```
# 5. 禁止使用var，一律使用let或const作为替换
# 6. 一个函数不能超过100行
# 7. 一个函数的输入参数不能超过6个
# 8. 一个类不能超过1000行
包括vue组件.
# 9. 一个函数的圈复杂度不能超过10
# 10. 条件语句的嵌套层数不能超过3层
尽量使用if-return的方式来避免，条件嵌套层数过多.
# 11. 即使只有一行的条件语句也必须使用{}，避免后续扩展时造成else悬垂歧义.
坏的例子：
```js
let a = 10
if (a < 10) 
    if (a == 10)
        alert('a等于10')
else 
    alert('a不小于10')
```
从字面上理解，这个else理解为第一个if和第二个if都是合理的，但是实际上它的执行为第二个. 这样会造成歧义，增加代码的阅读成本.
# 12. 禁止在代码中使用：eval, with
# 13. 去掉没有意义的注释，只保留必要的注释，尽量让代码可以自注释.
# 14. 书写样式规范请参考airbnb



No. 1            Javascript Files: All javascript files will have the file extension .js and Javascript code should not be embedded in HTML files
The file name same should begin with a capitalcase letter, and the first letter of each subsequent new word should be uppercase with all other letters lowercase (UppercaseCamelCase) .
All Javascript will be included into HTML as late as possible to reduce the effects of rendering delays imposed by script loading.
To include Javascript into HTML, the following format will be adopted:
<script type='text/javascript' src='filename.js'></script>
这条规则可能不适合某些情况，推荐在<head>中包含Js文件。
 
No. 2            Comments: Same rule of comments as C++ need be used.
Use block style comments for formal documentation i.e. documenting the class.
Otherwise, use line comments:
/*
Class documentation goes here
*/
// comments relating to a specific piece of code
All comments must add value. Useless comments should be avoided.
 

 

 
No. 5            Variable: Same naming rule as function.
Variable names should begin with a lowercase letter, and the first letter of each subsequent word should be uppercase with all other letters lowercase.
变量名的规则也同function，驼峰规则。
 
No. 6            Use single quotes to delimit strings.
This means XML fragments in code can contain double quotes inside literal strings with ease e.g.
var content = '<div id="box">content</div>';
在Powershell比较强调这个，单引号括起来的字符串是保持原样的，但是双引号里面的替换符可能会生效。
 

 
No. 9            Avoid global variables.
They will inevitably:
  1. Introduce dependencies thorough the code between different components
  2. Making testing much more complex as functionalities of the components will rely of the existence of a global variable invalidating the concept that each component has to work in isolation
  3. Make impossible to reuse
  4. Reduce the flexibility of the application as each new component, introduced into the application, potentially will have to know about the global variables used in the application
 
No. 10         It is almost always better to use the === and !== operators in preference to the == and != operators (which do type coercion).
 
No. 11        eval is evil - avoid it as much as you can (can open up your code to injection attacks).
The following is a useful read about eval: http://javascriptweblog.wordpress.com/2010/04/19/how-evil-is-eval/

No. 12         Always add parentheses to ensure that the result is calculated as expected and to aid readability:
(((2 * 3) + 2) / (2 + 2)) //good
2*3 + 2 / 2 + 2                   //bad
 
No. 13         All code blocks will be enclosed with braces - a K&R style will be adopted i.e. the opening brace is placed at the end of the line:
if (a) {
// do something
}
 
No. 14         Each statement must be terminated with a semi-colon (exceptions are for, function, if, switch, try, while).
 
No. 15         The return value expression must start on the same line as the return keyword in order to avoid semi-colon insertion.
 
No. 16         if statements has same style as C++:
if (condition) {
// do something
} else if (condition) {
// do something
} else {
// do something
}
 
No. 17         switch statements has same style as C++:
switch (expression) {
case expression:
//do something
default:
//do something
}
  1. Each case is aligned with the switch. This avoids over-indentation.
  2. Each group of statements (except the default) should end with break, return, or throw.
 
No. 18        Do not use the with statement
It is considered dangerous, e.g:
//good
com.example.bing = true;
com.example.bang = true;
var obj = com.example
obj.bing = true;
obj.bang = true;
//bad
com.example.bing = true;
com.example.bang = true;
with(com.example){
bing = true;
bang = true;
}
 
No. 19        Use {} instead of new Object and [] instead of new Array()
someObject = {name: ‘hello’, value: ‘world’};
someArray = [ ‘hello’, ‘world’]
The advantaged of literals over the constructors are the following :
  1. Shorter and more readable
  2. Literals are safer, they will work even if the Array and Object constructors have been overridden
  3. Theoretically literals are faster (although any kind of bottleneck will be elsewhere)
 
No. 20         Functions should be called with no spaces between the function name, the opening parenthesis, and the first parameter; spaces between commas and each parameter, and no space between the last parameter, the closing parenthesis, and the semicolon as C++:
var fooBar = foo(‘bar’, ‘json’);