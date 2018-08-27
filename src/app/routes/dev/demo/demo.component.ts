
import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-demo',
  template: `
  <na-view-wrap labelWidth="100">
    <na-view label="ID">1</na-view>
    <na-view label="Name">asdf</na-view>
    <na-view label="Age">25</na-view>
    <na-view label="Reject" type="danger" col="1">
      OMG <a class="ml-sm" (click)="msg.success('to')">Fixed</a>
    </na-view>
    <na-view label="Default"></na-view>
    <na-view [label]="label">
      <ng-template #label>
        <a nz-tooltip="test">tip</a>
      </ng-template>
      Custom label
    </na-view>
  </na-view-wrap>
  `,
})
export class DemoComponent {
  constructor(public msg: NzMessageService) {
  }
}
