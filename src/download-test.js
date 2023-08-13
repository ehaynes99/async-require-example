const http = require('https')

const url =   'https://gist.githubusercontent.com/ehaynes99/79cfbf2250a2a0546008dbfa23faa041/raw/d7ebd9d7f9c7e3f472ff5d6ed75c1e8c9da8954c/index.js'
const run = async () => {
  const response = http.get(url, (response) => {
    let content = ''
   res.on('error',function(err){
        console.error(err);
    })
    res.on('data',function(chunk){
        body+=chunk.toString();
    });
    res.on('end',function(){
        console.log(body.length);
        console.log(body);
    });
  })
}

run().catch((error) => console.log('error'))
