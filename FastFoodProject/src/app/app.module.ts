import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SignupComponent } from './Components/signup/signup.component';
import { LoginComponent } from './Components/login/login.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { FooterComponent } from './Components/footer/footer.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AboutusComponent } from './Components/aboutus/aboutus.component';
import { ContactUsComponent } from './Components/contactus/contactus.component';
import { HomeComponent } from './Components/home/home.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserService } from './shared/services/user.service';
import { UserdashboardComponent } from './Components/userdashboard/userdashboard.component';
import { PizzaComponent } from './Components/pizza/pizza.component';
import { AdmindashboardComponent } from './Components/admindashboard/admindashboard.component';
import { FooditemformComponent } from './Components/fooditemform/fooditemform.component';
import { AddFoodItemComponent } from './Components/add-food-item/add-food-item.component';
import { ManageitemsComponent } from './Components/manageitems/manageitems.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { NgChartsModule } from 'ng2-charts';
import { UserProfileComponent } from './Components/user-profile/user-profile.component';
import { OrderConfirmationComponent } from './Components/order-confirmation/order-confirmation.component';
import { AdminOrderConfirmComponent } from './Components/admin-order-confirm/admin-order-confirm.component';
import { OrderlistComponent } from './Components/orderlist/orderlist.component';
import { ManageUsersComponent } from './Components/manage-users/manage-users.component';
import { CartComponent } from './Components/cart/cart.component';
import { FeedbacksComponent } from './Components/feedbacks/feedbacks.component';
import { CaroselComponent } from './Components/carosel/carosel.component';
import { MenuComponent } from './Components/menu/menu.component';
import { PaymentComponent } from './Components/payment/payment.component';
import { ForgotPasswordComponent } from './Components/forgot-password/forgot-password.component';


@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    NavbarComponent,
    FooterComponent,
    AboutusComponent,
    ContactUsComponent,
    HomeComponent,
    UserdashboardComponent,
    PizzaComponent,
    AdmindashboardComponent,
    ManageitemsComponent,
    FooditemformComponent,
    AddFoodItemComponent,
    UserProfileComponent,
    OrderConfirmationComponent,
    AdminOrderConfirmComponent,
    OrderlistComponent,
    ManageUsersComponent,
    CartComponent,
    FeedbacksComponent,
    CaroselComponent,
    MenuComponent,
    PaymentComponent,
    ForgotPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    BrowserAnimationsModule,
    NgbModule,
    NgbCarouselModule,
    NgChartsModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
