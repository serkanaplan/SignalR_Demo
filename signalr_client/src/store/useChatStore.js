import { create } from 'zustand';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // ReactToastify stillerini ekleyin

// Zustand Store
const useChatStore = create((set) => ({
    connection: null,
    messages: [],
    users: [], // Bağlı olan kullanıcılar
    connectionStatus: 'disconnected', // Bağlantı durumu

    setConnection: (connection) => set({ connection }),
    addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
    clearMessages: () => set({ messages: [] }),
    setUsers: (users) => set({ users }),

    // SignalR Bağlantısını Başlatma
    connectToHub: async () => {
        const connection = new HubConnectionBuilder()
            .withUrl('http://localhost:5000/myhub') // SignalR sunucusunun URL'sini belirt
            // .withAutomaticReconnect() // Otomatik yeniden bağlanma
            .withAutomaticReconnect([2000, 2000, 5000])
            .configureLogging(LogLevel.Information)
            .build();

        // bağlantıyı dinle
        connection.on('ReceiveMessage', (message) => {
            set((state) => ({ messages: [...state.messages, message] }));
        });

        // Bağlı Kullanıcılar Listesi Güncelleme
        connection.on('Clients', (clients) => {
            set({ users: clients }); // Bağlı kullanıcılar listesini güncelle
            console.log('Bağlı Kullanıcılar Listesi:', clients); // Konsola gelen kullanıcıları yazdırın
        });

        // Kullanıcı Bağlandığında
        connection.on('UserConnected', (userId) => {
            console.log(`Kullanıcı bağlandı: ${userId}`);
            toast.success(`Kullanıcı bağlandı: ${userId}`, { autoClose: 3000 }); // Toast bildirimi göster
        });

        // Kullanıcı Bağlantısı Koptuğunda
        connection.on('UserDisconnected', (userId) => {
            console.log(`Kullanıcı bağlantısı koptu: ${userId}`);
            toast.error(`Kullanıcı bağlantısı koptu: ${userId}`, { autoClose: 3000 }); // Toast bildirimi göster
        });

        // bağlanmadan önce
        connection.onreconnecting(() => {
            set({ connectionStatus: 'reconnecting' }); // Yeniden bağlanmaya çalışıyor
            toast.warn('Bağlantı kopuyor, yeniden bağlanmaya çalışılıyor...', { autoClose: 3000 }); // Toast bildirimi göster
            console.log('Bağlantı kopuyor, yeniden bağlanmaya çalışılıyor...');
        });

        // bağlandığında
        connection.onreconnected(() => {
            set({ connectionStatus: 'connected' }); // Bağlandı
            toast.success('Bağlantı başarılı!', { autoClose: 3000 }); // Toast bildirimi göster
            console.log('Bağlantı başarılı!');
        });

        // bağlantı kapandığında
        connection.onclose(() => {
            set({ connectionStatus: 'disconnected' }); // Bağlantı kapandı
            toast.error('Bağlantı kapandı, lütfen tekrar bağlanın.', { autoClose: 3000 }); // Toast bildirimi göster
            console.log('Bağlantı kapandı, lütfen tekrar bağlanın.');
        });


        try {
            await connection.start();
            set({ connection, connectionStatus: 'connected' }); // Başarılı bağlantı
            toast.success('SignalR bağlantısı başarılı!', { autoClose: 3000 }); // Toast bildirimi göster
            console.log('Bağlantı başarılı!');
        } catch (error) {
            console.error('SignalR bağlantı hatası:', error);
            set({ connectionStatus: 'disconnected' }); // Bağlantı durumu güncellenir
            toast.error('SignalR bağlantı hatası, tekrar bağlanmayı deniyorum...', { autoClose: 3000 }); // Toast bildirimi göster
            // Bağlantı hatası durumunda tekrar bağlanmayı dene
            setTimeout(() => useChatStore.getState().connectToHub(), 10000); // 10 saniye sonra yeniden dene
        }
    },

    // Mesaj Gönderme İşlemi
    sendMessage: async (message) => {
        const { connection } = useChatStore.getState();
        if (connection) {
            await connection.send('SendMessageAsync', message);
        }
    },
}));

export default useChatStore;
