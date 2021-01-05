### About

Peformance testing for elektron.live platform

### Run the tests

```
npm i
node index.js
```

### Create test video

```
curl https://sample-videos.com/video123/mp4/360/big_buck_bunny_360p_1mb.mp4 > test.mp4
ffmpeg -i test.mp4 -pix_fmt yuv420p -t 00:00:02.0 test.y4m
```
