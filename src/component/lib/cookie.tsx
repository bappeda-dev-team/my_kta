
export const login = async (username: string, password: string): Promise<boolean> => {
    const USERNAME_API = process.env.NEXT_PUBLIC_API_USERNAME || "-";
    const PASS_API = process.env.NEXT_PUBLIC_API_PASSWORD || "-";
    const credentials = btoa(`${USERNAME_API}:${PASS_API}`);


    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    }

    // Tambahkan header Authorization ke objek headers Anda
    const headersWithAuth = {
        ...headers, // Pastikan Anda menyertakan headers lain yang mungkin sudah ada
        'Authorization': `Basic ${credentials}`
    };
    try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: headersWithAuth,
            body: JSON.stringify({ username, password }),
        });

        // console.log(USERNAME_API, PASS_API)

        const data = await response.json();
        if (data.statusCode === 200) {
            // console.log('data dari response : ,', data);
            try {
                const token = data.data.access_token;
                const user = JSON.stringify(data.data.profile);
                // Simpan token di cookie
                document.cookie = `token=${token}; path=/;`;
                document.cookie = `user_id=${user}; path=/;`;
                alert("Login Berhasil")

                return true;
            } catch (decodeError) {
                alert("Login Gagal")

                return false;
            }
        } else if (data.statusCode === 400) {
            alert("Login Gagal")
            return false;
        } else {

            return false;
        }
    } catch (err) {
        alert("Login Gagal")

        return false;
    }
};
export const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') {
        // Jika di server-side, kembalikan null atau nilai default lainnya
        return null;
    }
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
};