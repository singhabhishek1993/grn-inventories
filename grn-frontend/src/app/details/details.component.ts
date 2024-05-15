import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;
  detailsForm!: FormGroup;
  formCount: number = 1;
  savedValues: any = {};

  // Mock data for dropdowns
  companies = ['Oriental Plantation Company Limited'];
  stores = ['Grow Room (Mentley Korat)'];
  itemCategories = ['Category1', 'Category2', 'Category3'];
  items = ['Item1', 'Item2', 'Item3'];
  strains = ['Strain1', 'Strain2', 'Strain3'];
  suppliers = ['Supplier1', 'Supplier2', 'Supplier3'];

  selectedCompany: string = '';
  selectedDate: Date | null = null;
  selectedStore: string = '';
  selectedRemarks: string = '';

  constructor(private http: HttpClient, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.detailsForm = this.formBuilder.group({
      company: ['', Validators.required],
      date: ['', Validators.required],
      store: ['', Validators.required],
      remarks: [''],
      inventories: this.formBuilder.array([this.createInventoryForm()])
    });
  }

  createInventoryForm(): FormGroup {
    return this.formBuilder.group({
      itemCategory: ['', Validators.required],
      item: ['', Validators.required],
      strain: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]], 
      uom: ['', Validators.required],
      totalCost: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]], 
      costPerUnit: [''],
      supplier: ['', Validators.required]
    });
  }
  

  onCompanySelect(event: any) {
    this.selectedCompany = event.value;
  }

  onDateSelect(event: any) {
    this.selectedDate = event.value;
  }

  onStoreSelect(event: any) {
    this.selectedStore = event.value;
  }

  onRemarksChange(event: any) {
    this.selectedRemarks = event.target.value;
  }

  get inventories(): FormArray {
    return this.detailsForm.get('inventories') as FormArray;
  }

  addNewForm(): void {
    this.inventories.push(this.createInventoryForm());
    this.formCount++;
  }

  deleteForm(index: number): void {
    this.inventories.removeAt(index);
    this.formCount--;
  }

  clearForm(index: number): void {
    this.inventories.at(index).reset();
  }

  onNext(): void {
    if (this.detailsForm.valid) {
      this.savedValues = this.detailsForm.value;
      this.selectedCompany = this.detailsForm.get('company')?.value;
      this.selectedDate = this.detailsForm.get('date')?.value;
      this.selectedStore = this.detailsForm.get('store')?.value;
      this.selectedRemarks = this.detailsForm.get('remarks')?.value;
    }
  }

  onSubmit(saveAsDraft: boolean = false) {
    if (this.detailsForm.valid) {
      this.savedValues = this.detailsForm.value;
      if (saveAsDraft) {
        console.log('Draft saved:', this.savedValues);
        // Save the draft
      } else {
        console.log('Form submitted:', this.savedValues);
        this.submitForm(this.savedValues); 
      }
    }
  }

  submitForm(formData: any) {
    console.log('Submitting form data:', formData); 
    this.http.post<any>('http://localhost:3000/submit-form', formData)
      .subscribe((response: any) => {
        console.log('Response from server:', response);
      }, (error: any) => {
        console.error('Error submitting form:', error);
      });
  }

  onCancel() {
    this.detailsForm.reset();
    console.log('Cancel button clicked');
  }
}
