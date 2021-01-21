import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, ModalController } from '@ionic/angular';
import { Todo } from 'src/app/models/todo';
import { ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-todo-details',
  templateUrl: './todo-details.page.html',
  styleUrls: ['./todo-details.page.scss'],
})
export class TodoDetailsPage implements OnInit {
  todo: Todo;

  constructor(private listService: ListService, private route: ActivatedRoute, private router: Router, private toast: ToastController, private modalController: ModalController) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params && params['id']) {
        //this.todo = this.listService.getOne(+params['id']);
      }
    })
    
  }

  back(): void{
    this.router.navigateByUrl('/home');
  }
}