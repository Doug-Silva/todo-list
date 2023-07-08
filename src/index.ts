(() => {

    //enum tipos de notificações
    enum NotificationPlatform {
        SMS = 'SMS',
        EMAIL = 'EMAIL',
        PUSH_NOTIFICATION = 'PUSH_NOTIFICATION',
    }

    //função para atribuir um ID
    const UUID = (): string => {
        return Math.random().toString(32).substring(2, 9);
    };

    //função para formatar a data
    const DateUtils = {
        tomorrow(): Date {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            return tomorrow;
        },

        today(): Date {
            return new Date();
        },

        formatDate(date: Date): string {
            return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
        }
    };

    //interface para as Task (Tarefas)
    interface Task {
        id: string;
        dateCreated: Date;
        dateUpdated: Date;
        description: string;
        render(): string;
    }

    //classe Reminder (Lembrete)
    class Reminder implements Task {
        id: string = UUID();
        dateCreated: Date = DateUtils.today();
        dateUpdated: Date = DateUtils.today();
        description: string = '';

        date: Date = DateUtils.tomorrow();
        notifications: Array<NotificationPlatform> = [NotificationPlatform.EMAIL];

        constructor(description: string, date: Date, notifications: Array<NotificationPlatform>) {
            this.description = description;
            this.date = date;
            this.notifications = notifications;
        }

        render(): string {
            return `
            ---> Reminder <---
            description: ${this.description}
            date: ${DateUtils.formatDate(this.date)}
            platform: ${this.notifications.join(',')}
            `;
        }
    }

    //classe TODO (Pendência)
    class Todo implements Task {
        id: string = UUID();
        dateCreated: Date = DateUtils.today();
        dateUpdated: Date = DateUtils.today();
        description: string = '';

        done: boolean = false;

        constructor(description: string) {
            this.description = description;
        }

        render(): string {
            return `
            ---> TODO <---
            description: ${this.description}
            done: ${this.done}
            `;
        } 
    }

    const todo = new Todo('TODO criado com a classe');
    const reminder = new Reminder('Reminder criado com a classe', new Date(), [NotificationPlatform.EMAIL]);

    //criando a view
    const taskView = {
        render(tasks: Array<Task>) {
            const tasksList = document.getElementById('tasksList');

            //esvaziar a lista
            while (tasksList?.firstChild) {
                tasksList.removeChild(tasksList.firstChild);
            }

            tasks.forEach((task) => {
                const li = document.createElement('LI');
                const textNode = document.createTextNode(task.render());
                li.appendChild(textNode);
                tasksList?.appendChild(li);
            })
        },
    };

    //criando controller
    const TaskController = (view: typeof taskView) => {
        const tasks: Array<Task> = [todo, reminder];

        const handleEvent = (event: Event) => {
            event.preventDefault();
            view.render(tasks);
        };

        document.getElementById('taskForm')?.addEventListener('submit', handleEvent);
    };

    TaskController(taskView);
})();