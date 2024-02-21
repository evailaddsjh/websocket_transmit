const WebSocket = require('ws');

// 创建一个 WebSocket 服务器，监听在指定端口
const wss = new WebSocket.Server({ port: 31212 });

// 存储所有连接的客户端
const clients = new Set();

// 当有新连接建立时触发
wss.on('connection', (ws) => {
    // 连接建立后的处理逻辑
    console.log('Client connected');

    // 将新连接的客户端添加到集合中
    clients.add(ws);

    // 监听客户端发送的消息
    ws.on('message', (data) => {
        try {
            // 解析收到的 JSON 数据
            const message = JSON.parse(data);

            // 广播所有消息
            broadcast(message)
        } catch (error) {
            console.error('Error parsing JSON:', data);
        }
    });

    // 监听连接断开事件
    ws.on('close', () => {
        console.log('Client disconnected');

        // 从集合中移除断开连接的客户端
        clients.delete(ws);
    });
});

// 定义广播函数
function broadcast(message) {
    // 转换对象为 JSON 字符串
    const jsonMessage = JSON.stringify(message);

    // 遍历所有连接的客户端并发送 JSON 消息
    for (const client of clients) {
        client.send(jsonMessage);
    }
}

console.log('WebSocket server is listening on port 31212');
