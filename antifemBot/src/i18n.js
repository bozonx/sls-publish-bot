export default {
	ru: {
		today: 'Сегодня',
		tomorrow: 'Завтра',
		afterTomorrow: 'Послезавтра',
		daysOfWeek: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'],
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
		statePublisher: 'Кто сделал',

		// Button texts
		// toHomeBtn: 'На главную',
		cancelBtn: 'Отмена',
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
		publicateNowBtn: 'Опубликовать сейчас',
		replaceOnlyTextBtn: 'Заменить только текст',
		replaceOnlyMediaBtn: 'Заменить только медиа',
		replaceTextAndMediaBtn: 'Заменить медиа и текст и медиа',
		removeTextBtn: 'Удалить текст',
		removeMediaBtn: 'Удалить медиа',

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
		selectDateDescr:
			'Выберете дату либо введите в формате DD.MM. Часовая зона (${TIME_ZONE})',
		selectHourDescr:
			'Выберете время публикации. Часовая зона (${TIME_ZONE}).\nЕсли выбрете час то минуты будут установлены в 00.\nЕсли нужно более точное время то введите его в формате 1:23 или 01:23',
		scheduledListDescr: 'Выберете отложенную публикацию для управления',
		scheduledEmptyListDescr: 'Нет отложенных публикаций',
		scheduledItemDescr: 'Управление отложенной публикацией',

		// Messages
		wrongTypeOfPost:
			'❗ Этот формат поста не поддерживается. Отправьте текст, картинку или видео.',
		youAreNotRegistered:
			'Вы не зарегистрированы, перешлите это сообщение админу',
		tagWasAdded: 'Тэги были добавлены',
		tagWasDeleted: 'Тэг был удалён',
		scheduledItemWasDeleted: 'Отложенный пост был удалён',
		scheduledItemWasPublished: 'Отложенный пост был успешно опубликован',
		infoMsgToAdminChannel: 'Этот пост будет опубликован в канале',
		wrongTimeFormat: 'Не получается распознать время',
		wrongDateFormat: 'Не получается распознать дату',
	},
};
