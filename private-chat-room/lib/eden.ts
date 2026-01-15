import {treaty} from '@elysiajs/eden'
import type {app} from '@/app/api/[[...slugs]]/route'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const api = treaty<typeof app>(API_URL).api