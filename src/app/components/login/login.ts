import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {environment} from '../../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import {SupabaseService} from '../../services/supabase.service';
import {User} from '@supabase/supabase-js';
import {DebugService} from '../../services/debug.service';

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

  public user : User | null = null;

  constructor(private router: Router,private route: ActivatedRoute,private fb: FormBuilder, private supabaseService: SupabaseService, private debugService: DebugService) {
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.user = this.route.snapshot.data['user'];
  }

  public onDisconnect(){
    this.supabaseService.signOut().then((res) => {
      if(res.error){
        this.errorMsg = res.error.message;
      }else {
        this.user = null;
      }
    })
  }

  public onCloseLogin(){
    this.router.navigate(['/']);
  }

  async signIn() {
    this.validationPending = true;
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    const { email, password } = this.loginForm.value;

    this.supabaseService.signInWithPassword(email,password).then(
      (res) => {
        if(res.error){
          this.errorMsg = res.error.message;
        }else {
          this.router.navigate(['/']);
        }
      });
    this.loading = false;
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  public setLogVisibility(){
    this.debugService.visibility = !this.debugService.visibility;
  }

  public getLogVisibility() {
    return this.debugService.visibility
  }

  public clearLog(){
      this.debugService.clearLogs()
  }

  protected readonly environment = environment;
}
