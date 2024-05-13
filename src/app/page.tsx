'use client';

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useState } from "react";
import axios from 'axios';

import 'dotenv/config'; // .env 

interface Message {
  description: string,
  id: number,
  role: string
}

export default function Home() {

  const[input, setInput] = useState('');
  const[messages, setMessages] = useState<Message[]>([]);

  const api = axios.create({
    baseURL: process.env.URL_BACKEND,
  });

  function handleSendQuestion () {
    if (messages.length > 0)
      setMessages([]);

    const message = { role: 'user', description: input, id: 0 };

    setMessages(state => [...state, message]);

    answer(message.description);

    setInput('');
  }

  async function answer(question:string) {
    const response = await api.post('/', {
      question
    });

    console.log(response.data)

    var description = response.data.message;

    setMessages(state => [...state, { role: 'ia', description: description, id: 1 }]);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <Card className="w-[450px] h-[700px] flex flex-col">
        <CardHeader>
          <CardTitle>Chat AI</CardTitle>
          <CardDescription>Tire suas dúvidas by SAC</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 h-[500px]">
          <ScrollArea className="p-2">
            <div className="flex flex-col gap-4">
              {messages.map(message => {
                return (
                    <div key={message.id} className="flex gap-3">
                      <Avatar>
                        <AvatarImage src={`https://github.com/${message.role === 'user' ? 'gustavotn' : 'AvantSoftwares'}.png`} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <p className="text-sm leading-relaxed text-slate-700">
                        <span className="block font-bold text-slate-800">{message.role === 'user' ? 'Usuário' : 'SAC'}:</span>
                        {message.description}
                      </p>
                    </div>
                  )
                })}
              </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex gap-3">
          <Input 
            placeholder="Como posso te ajudar?"
            value={input}
            onChange={e => setInput(e.target.value)}
          >
          </Input>
          <Button onClick={handleSendQuestion}>Enviar</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
