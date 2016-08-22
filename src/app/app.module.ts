/**
 * Created by Tony Wang on 8/22/16.
 */
import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {AppComponent} from "./component/app.component";
@NgModule({
  imports: [
    BrowserModule,
  ],
  declarations: [
    AppComponent
  ],
  exports: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}
