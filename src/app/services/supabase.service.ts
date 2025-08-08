import { Injectable } from '@angular/core';
import {createClient, PostgrestError, SupabaseClient, UserResponse} from '@supabase/supabase-js';
import {OmdbMovie, SupaBaseMovie} from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  private production: boolean = true;
  private supabaseUrl: string = "https://xfkipzmnzrmikdqzydow.supabase.co"
  private supabaseKey:string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhma2lwem1uenJtaWtkcXp5ZG93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2OTQ2MzcsImV4cCI6MjA2OTI3MDYzN30.uAKr-ww5JPKrKBISRu0Ds3OvxlMgmOwmLk5W6fAj_qk"

  constructor() {
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
  }

  public getUser(){
    return this.supabase.auth.getUser()
  }

  public signInWithPassword(email:string, password:string){
    return this.supabase.auth.signInWithPassword({
      email,
      password,
    });
  }

  public signOut() {
    return this.supabase.auth.signOut()
  }

  // CREATE
  async addMovie(movie: SupaBaseMovie) {
    const { data, error } : {
      data: SupaBaseMovie[] | null;
      error: PostgrestError | null;
    } = await this.supabase
      .from('movies')
      .insert([movie])
      .select();
    return { data, error };
  }

  // READ
  async getMovies() {
    const { data, error } = await this.supabase
      .from('movies')
      .select('*')
      .order('id', { ascending: false });
    return { data, error };
  }

  // UPDATE
  async updateMovie(id: number, movie: Partial<SupaBaseMovie>) {
    const { data, error } = await this.supabase
      .from('movies')
      .update(movie)
      .eq('id', id);
    return { data, error };
  }

  // DELETE
  async deleteMovie(id: number) {
    const { data, error } = await this.supabase
      .from('movies')
      .delete()
      .eq('id', id);
    return { data, error };
  }
}
