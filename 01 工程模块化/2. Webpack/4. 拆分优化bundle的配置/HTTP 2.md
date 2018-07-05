https://medium.com/webpack/webpack-http-2-7083ec3f3ce6


With HTTP/2 you don’t need to bundle your modules anymore.

HTTP/2 can multiplex all your modules over the same connection in parallel. So there are no additional round trips for the many requests. Each module can be separately cached.

Sadly it’s not that easy in reality.

Prior work

You can read the following articles, which explain everything in detail and do some experiments to verify them (or just skip and and read the summary).

This is the gist of the articles:

    There is still a protocol overhead for each request compared to a single concatenated file.
    The compression of the single large file is better than many small files.
    Servers are slower serving many small files than a single large file.

So we need to find the middle ground to get the best for both worlds. We put the modules into n bundles where n is greater than 1 and smaller than the number of modules. Changing one module invalidates the cache for one bundle which is only a part of the complete application. The remaining application is still cached.

    More bundles means better caching, but less compression.

The AggressiveSplittingPlugin

The upcoming webpack 2 gives you the tool to do so. The most webpack internals are already there anyway. We already have chunks as a group of modules which form a output file. We have an optimization phase which can change these chunks. We just need a plugin to perform this optimization.

The AggressiveSplittingPlugin splits the original chunks into smaller chunks. You specify the chunk size you want to have. This improves the caching while worsens the compression (and transferring for HTTP/1).

To combine similar modules, they are sorted alphabetically (by path) before splitting. Modules in the same folder are probably related to each other and similar from compression point of view. With this sorting they end up in the same chunk.

Now we have efficient chunking for HTTP/2.

Changes to the application

But that’s not the end of the story. When the application is updated we need to try hard to reuse the previously created chunks. Therefore every time the AggressiveSplittingPlugin finds a good chunk (size within the limits), it stores the chunk’s modules and hash into records.

    Records is webpack’s concept of state that is kept between compilations. It’s stored to and read from a JSON file.

When the AggressiveSplittingPlugin is called again it first tries to restore the chunks from records before trying to split the remaining modules. This ensures that cached chunks are reused.
Bootstrapping and Server

An application using this technique no longer emits a single file which can be included in the HTML file. It emits multiple chunks which all need to be loaded. In an application using this optimization multiple script-tags are used to load every chunk (in parallel). Maybe like this:

webpack emit these chunk in order of age. The oldest file is executed first and the most recent one last. The browser can start executing files in cache while waiting for the download of the most recent files. Older files are more likely to be in the cache already.

HTTP/2 Server push can be used to send these chunks to the client when the HTML page is requested. Best start pushing the most recent file first, as older files are more likely to be in the cache already. The client can cancel push responses for files it already have, but this takes a round trip.

When using Code Splitting for on demand loading webpack handles the parallel requests for you.
Conclusion

webpack 2 gives you the tooling to improve caching and transfer of your application when using HTTP/2. Don’t be afraid that your stack won’t be future-proof.

Note that the AggressiveSplittingPlugin is still experimental.

I’m very interested in your experiences…


