export default {
	ru: {
		today: 'Сегодня',
		tomorrow: 'Завтра',
		afterTomorrow: 'Послезавтра',
		msk: 'МСК',

		// Template names
		'template-default': 'Основной',
		'template-byFollower': 'От подписчика',
		'template-noFooter': 'Без футера',

		// State keys
		statePostType: 'Тип поста',
		stateTextLength: 'Кол. символов текста',
		stateMediaCount: 'Кол. медиа файлов',
		stateAuthor: 'Автор',
		stateTags: 'Тэги',
		stateDate: 'Дата',
		stateTime: 'Время',
		stateTemplate: 'Шаблон',
		stateUrlPreview: 'Предпросмотр ссылки',

		// Button texts
		toHomeBtn: 'На главную',
		backBtn: 'Назад',
		nextBtn: 'Далее',
		editConfigBtn: 'Редактирование конфига',
		manageUsersBtn: 'Управление пользователями',
		manageTagsBtn: 'Управлять тэгами',
		withoutAuthorBtn: 'Без автора',
		clearTagsBtn: 'Сбросить тэги',
		useTemplateBtn: 'Использовать шаблон',
		// previewBtn: 'Посмотреть результат',
		previewOffBtn: 'Выключить link preview',
		previewOnBtn: 'Включить link preview',
		pubConfirmBtn: 'Да',

		// Menu descriptions
		homeDescr:
			'Напишите текст поста, картинку или видео (можно несколько) или перешлите из другого чата. (Текст или картинку можно будет добавить или изменить позже)',
		editConfigDescr: 'Отредактируйте конфиг в формате YAML и отправьте обратно',
		tagsManagerDescr:
			'Выберете тэги которые нужно удалить. Чтобы добавить новый тэг - напишите его. Он будет переведён в snake_case. Символ # не нужен',
		usersManagerDescr:
			'Чтобы удалить юзера, нажмите на соответсвующую кнопку. Чтобы добавить скиньне сюда пересланое сообщение от юзера. Либо напишиет сообщение в формате YAML с полями ID: number, NAME: string, IS_ADMIN?: boolean',
		selectAuthorDescr:
			'Выберeте одного из постоянных авторов или введите другое имя автора',
		uploadContentDescr:
			'Проверьте отображение текста и медиа(если есть). Замените/добавьте текст и медиа',
		selectTagsDescr: 'Выберете тэги',
		pubPostSetupDescr: 'Проверьте и настройте публикацию',
		pubConfirmDescr: 'Публикуем?',
		selectDateDescr: 'Выберете дату',
		selectHourDescr: 'Выберете час. (минуты будут установлены в 00)',

		// Messages
		welcomeAgain: 'И снова здравствуйте!',
		youAreNotRegistered:
			'Вы не зарегистрированы, перешлите это сообщение админу',
		tagWasAdded: 'Тэги были добавлены',
		tagWasDeleted: 'Тэг был удалён',
	},
};
