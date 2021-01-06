### About

Peformance testing for elektron.live platform

### Usage

#### 1. Install dependencies

```
npm i
```

#### 2. Create test audience video

```
curl https://sample-videos.com/video123/mp4/360/big_buck_bunny_360p_1mb.mp4 > test_audience.mp4
ffmpeg -i test_audience.mp4 -pix_fmt yuv420p -t 00:00:02.0 test_audience.y4m
```

#### 3. Upstream performer video (optional)

```
curl https://sample-videos.com/video123/mp4/480/big_buck_bunny_480p_1mb.mp4 > test_performer.mp4
ffmpeg -stream_loop -1 -re -i test_performer.mp4 -c:v libx264 -crf 19 -f flv rtmp://o1.babahhcdn.com:1935/bb1150-lo/perftest
```

#### 4. Run the tests in a separate terminal tab

```
node index.js
```
