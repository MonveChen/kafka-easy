/*
 * @Author: Monve
 * @Date: 2021-12-17 15:54:15
 * @LastEditors: Monve
 * @LastEditTime: 2021-12-24 14:53:52
 * @FilePath: /kafka-easy/src/KafkaEasy.ts
 */
import { Admin, Consumer, Kafka, KafkaConfig, Message, Producer } from 'kafkajs'

export class KafkaEasy {
  kafka: Kafka;
  admin: Admin;
  producer: Producer;
  consumer: Consumer;
  topic: string;
  groupId: string;
  constructor(config: KafkaConfig, topic: string, groupId?: string) {
    const kafka = new Kafka(config);
    this.topic = topic;
    this.groupId = groupId || `${topic}_group`;
    this.admin = kafka.admin()
    this.producer = kafka.producer()
    this.consumer = kafka.consumer({ groupId: this.groupId })
  }

  fetchOffset = async () => {
    await this.admin.connect()
    return await this.admin.fetchOffsets({ topic: this.topic, groupId: this.groupId })
  }

  send = async (msg: Message[]) => {
    await this.producer.connect()
    return await this.producer.send({
      topic: this.topic,
      messages: msg
    })
  }

  subscribe = async (callback: (msg: string) => Promise<void>) => {
    await this.consumer.connect()
    await this.consumer.subscribe({
      topic: this.topic
    })
    await this.consumer.run({
      eachMessage: async ({
        partition,
        message
      }) => {
        await this.consumer.commitOffsets([{ //提前设置offset防止重复消费数据
          topic: this.topic,
          partition: partition,
          offset: (Number(message.offset) + 1).toString()
        }])
        const msg = message.value?.toString()
        if (msg) {
          await callback(msg);
        } else {
          console.error('msg 为空, message:', message)
        }
      }
    })
  }

}