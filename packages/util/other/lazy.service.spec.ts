import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { NzSafeAny } from 'ng-zorro-antd/core/types';

import { LazyService } from './lazy.service';

let testStatus = 'ok';
class MockDocument {
  querySelectorAll(): NzSafeAny {
    return {};
  }
  getElementsByTagName = (): NzSafeAny => {
    return [
      {
        appendChild: (node: NzSafeAny) => {
          if (node.testStatus === 'ok') {
            if (node.readyState) {
              node.readyState = 'complete';
              node.onreadystatechange();
            } else {
              node.onload();
            }
            return;
          }
          node.onerror();
        }
      }
    ];
  };
  createElement = (): NzSafeAny => {
    const ret: NzSafeAny = {
      testStatus,
      onload: () => {}
    };
    return ret;
  };
}

describe('utils: lazy', () => {
  let srv: LazyService;
  let doc: Document;
  beforeEach(() => {
    testStatus = 'ok';
    TestBed.configureTestingModule({
      providers: [{ provide: DOCUMENT, useClass: MockDocument }]
    });
    srv = TestBed.inject(LazyService);
    srv.clear();
    doc = TestBed.inject(DOCUMENT);
  });

  describe('Scripts', () => {
    it('should be load a js resource', done => {
      srv.change.subscribe(res => {
        expect(res[0].status).toBe('ok');
        done();
      });
      srv.load('/1.js');
    });
    it('should be custom content', () => {
      const res: NzSafeAny = {};
      const content = 'var a = 1;';
      spyOn(doc, 'createElement').and.callFake(() => res);
      srv.loadScript('/1.js', content);
      expect(res.innerHTML).toBe(content);
    });
  });

  describe('Styles', () => {
    it('should be load a css resource', done => {
      srv.change.subscribe(res => {
        expect(res[0].status).toBe('ok');
        done();
      });
      srv.load('/1.css');
    });
    it('should be load a less resource', done => {
      srv.loadStyle('/1.less', 'stylesheet/less').then(res => {
        expect(res.status).toBe('ok');
        done();
      });
    });
    it('should be custom content', () => {
      const res: NzSafeAny = {
        onerror(): void {}
      };
      const content = 'var a = 1;';
      spyOn(doc, 'createElement').and.callFake(() => res);
      srv.loadStyle('/1.js', 'stylesheet/less', content);
      expect(res.innerHTML).toBe(content);
    });
  });

  it('should be immediately when loaded a js resource', () => {
    let count = 0;
    spyOn(doc, 'createElement').and.callFake(() => {
      ++count;
      return new MockDocument().createElement();
    });
    srv.load('/2.js');
    expect(count).toBe(1);
    srv.load('/2.js');
    expect(count).toBe(1);
  });

  it('should be immediately when loaded a css resource', () => {
    let count = 0;
    spyOn(doc, 'createElement').and.callFake(() => {
      ++count;
      return new MockDocument().createElement();
    });
    srv.load('/2.css');
    expect(count).toBe(1);
    srv.load('/2.css');
    expect(count).toBe(1);
  });

  it('should be bad resource', done => {
    testStatus = 'bad';
    srv.change.subscribe(res => {
      expect(res[0].status).toBe('error');
      done();
    });
    srv.load('/3.js');
  });
});
