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
		previewOffBtn: 'Выключить link preview',
		previewOnBtn: 'Включить link preview',
		pubConfirmBtn: 'Да',
		showPreviewBtn: 'Предпросмотр',
		deletePostponedBtn: 'Удалить',
		editPostponedBtn: 'Редактировать',
		changeDateTimeBtn: 'Изменить время',
		manageScheduledBtn: 'Управлять отложенными постами',
		publicateNowBtn: 'Опубликаовать сейчас',

		// Menu descriptions
		homeDescr:
			'Приветствую в боте публикации постов в канал Антифеминизм | Маскулизм!\n\nНапишите текст поста, картинку или видео (можно несколько) или перешлите из другого чата. (Текст или картинку можно будет добавить или изменить позже)',
		editConfigDescr: 'Отредактируйте конфиг в формате YAML и отправьте обратно',
		tagsManagerDescr:
			'Выберете тэги которые нужно удалить. Чтобы добавить новый тэг - напишите его. Он будет переведён в snake_case. Символ # не нужен',
		usersManagerDescr:
			'Чтобы удалить юзера, нажмите на соответсвующую кнопку. Чтобы добавить скиньне сюда пересланое сообщение от юзера. Либо напишиет сообщение в формате YAML с полями id: number, name: string, isAdmin?: boolean',
		selectAuthorDescr:
			'Выберeте одного из постоянных авторов или введите другое имя автора',
		uploadContentDescr:
			'Проверьте отображение текста и медиа(если есть). Замените/добавьте текст и медиа',
		selectTagsDescr: 'Выберете тэги',
		pubPostSetupDescr: 'Проверьте и настройте публикацию',
		pubConfirmDescr: 'Публикуем?',
		selectDateDescr: 'Выберете дату',
		selectHourDescr: 'Выберете час. (минуты будут установлены в 00)',
		scheduledListDescr: 'Выберете отложенную публикацию для управления',
		scheduledItemDescr: 'Управление отложенной публикацией',

		// Messages
		youAreNotRegistered:
			'Вы не зарегистрированы, перешлите это сообщение админу',
		tagWasAdded: 'Тэги были добавлены',
		tagWasDeleted: 'Тэг был удалён',
		scheduledItemWasDeleted: 'Отложенный пост был удалён',
		scheduledItemWasPublished: 'Отложенный пост был успешно опубликован',
		infoMsgToAdminChannel: 'Этот пост будет опубликован в канале',
	},
};
