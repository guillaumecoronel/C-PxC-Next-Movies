import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Injectable({ providedIn: 'root' })
export class UserResolver implements Resolve<any> {
  constructor(private supabase: SupabaseService) {}

  async resolve() {
    // Attend que l'utilisateur soit récupéré
    const user = await this.supabase.getUser();
    return user.data.user || null;
  }
}
