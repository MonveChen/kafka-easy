# kafka-easy
#### About the Project

easy use for kafkajs

#### Usage

```js
import { KafkaEasy } from './utils/KafkaEasy'

const kafka = new KafkaEasy({
  clientId: 'my-app',
  brokers: [
    "lzb-kafka.dibiaozuitu.com:9092"
  ],
  retry: {
    retries: 8
  }
}, 'topic')

#producer send msg
kafka.send([{ value: '1' }])

#consumer subscribe
kafka.subscribe((msg)=>{
  console.log(msg);
})

```

