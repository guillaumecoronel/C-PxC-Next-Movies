import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  errorMsg = '';

  validationPending : boolean = false;

  // supabase: SupabaseClient;

  constructor(private router: Router,private fb: FormBuilder) {
    // this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  public onCloseLogin(){
    this.router.navigate(['/']);
  }

  async signIn() {
    this.validationPending = true;
  //   if (this.loginForm.invalid) {
  //     this.loginForm.markAllAsTouched();
  //     return;
  //   }
  //
  //   this.loading = true;
  //   this.errorMsg = '';
  //
  //   const { email, password } = this.loginForm.value;
  //
  //   const { error } = await this.supabase.auth.signInWithPassword({
  //     email,
  //     password,
  //   });
  //
  //   this.loading = false;
  //
  //   if (error) {
  //     this.errorMsg = error.message;
  //   } else {
  //     console.log('Login success');
  //     // Exemple : navigation, etc.
  //   }
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  protected readonly environment = environment;
}
