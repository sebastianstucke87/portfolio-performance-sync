export class SessionExtractor {
    extractPersonId(): string {
        const sessionCookie = this.getCookieValue('session');
        if (!sessionCookie) {
            throw new Error('Session cookie not found');
        }

        const decoded = decodeURIComponent(sessionCookie);
        const parsed = JSON.parse(decoded) as { user?: { userId?: string } };

        if (!parsed.user?.userId) {
            throw new Error('User ID not found in session cookie');
        }

        return parsed.user.userId;
    }

    private getCookieValue(name: string): string | null {
        const cookies = document.cookie.split('; ');

        for (const cookie of cookies) {
            const [cookieName, ...valueParts] = cookie.split('=');

            if (cookieName === name) {
                return valueParts.join('=');
            }
        }

        return null;
    }
}
