import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { filter } from 'rxjs';
//import * as internal from 'stream';
import { CityCto } from '../cto/city.cto';
import { CustomerCto } from '../cto/customer.cto';
import { PhoneCallsCto } from '../cto/phone-calls.cto';
import { CustomerCallsService } from '../shared/customer-calls.service';

@Component({
  selector: 'app-customer-calls',
  templateUrl: './customer-calls.component.html',
  styleUrls: ['./customer-calls.component.css']
})
  
export class CustomerCallsComponent implements OnInit {
   
  customersAll: CustomerCto[] = [];
  customersSorted: CustomerCto[] = [];
  cities: CityCto[] = [];
  selectedCity: string = 'all';
  closeModal: string = '';
  modalPhones: PhoneCallsCto[] = [];
  selectedCustomer: CustomerCto = new CustomerCto();

  constructor(private service: CustomerCallsService,
          private modalService: NgbModal) { }

  async ngOnInit() {
    //debugger;
    this.customersAll = await this.service.refreshLists();
    this.customersSorted = [...this.customersAll];
    this.cities = [{ id: -1, name: 'all' },...this.service.cities$];

      
  }
 
  onSelectChange(event : any) {
    this.selectedCity = event.target.options[event.target.options.selectedIndex].text;
    this.filterCity(this.selectedCity );
    
    
  }
  filterCity(city: string) {
    if (this.selectedCity == "all") {
      this.customersSorted = [...this.customersAll]
    } else {
      this.customersSorted = this.customersAll.filter((cust)=> cust.city == city).sort((a, b) => a.sumCalls - b.sumCalls)
    }
    
  }
  showDetails(pd: CustomerCto, content: any) {
    this.selectedCustomer = pd;
    this.service.getPhoneCalls$(pd.customerId).toPromise().then(
      data => {
        if (data) {
          this.modalPhones = data;
          this.triggerModal(content);
        }
        

      }
    ).catch(p => { });
    
  }
  triggerModal(content : any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then((res) => {
        this.closeModal = `Closed with: ${res}`;
        
    }, (res) => {
        this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
        
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
