import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

const LAYOUT_ROUTES = [];

@NgModule({
    imports: [RouterModule.forRoot([], { useHash: true })],
    exports: [RouterModule]
})
export class ToolChatAppRoutingModule {}
