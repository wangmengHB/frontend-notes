# devServer
在没有webpack-dev-server之前，通常前端开发会自己用nodejs写一个mock的server仅仅用于开发模拟各种api返回. 当你开发的工程多的时候，这样就会有大量的重复的并且没有什么实际用途的代码.
于是，webpack对此做了一个抽象并且支持HRM，提供了两种形式的支持：webpack-dev-server 和 webpack-dev-middleware.

