import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {UserRole} from "@/common/enums/user";

export function middleware(request: NextRequest) {
    const role = request.cookies.get('user_role')?.value;
    const token = request.cookies.get('token')?.value;
    
    if (request.nextUrl.pathname.startsWith('/users'))  {
        if(!token) {
            return NextResponse.rewrite(new URL('/login', request.url));
        }
    }
    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (role !== UserRole.ADMIN) {
            return NextResponse.rewrite(new URL('/404', request.url));
        }
    }
    if (request.nextUrl.pathname.startsWith('/owner')) {
        if (role !== UserRole.OWNER) {
            return NextResponse.rewrite(new URL('/404', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};