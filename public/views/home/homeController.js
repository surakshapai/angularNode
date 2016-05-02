angular.module('myApp')
	.controller('HomeController', ['$scope', 'Auth', 'User', 'Post', '$location', '$stateParams', function($scope, Auth, User, Post, $location, $stateParams) {
		$scope.currentUserModel = Auth.getCurrentUser();
		$scope.userName = $scope.currentUserModel.username;
		$scope.currentUserChallenges = $scope.currentUserModel.userChallenge;
		$scope.numberOfUserPosts = 0;
		var userId = $scope.currentUserModel.userId;
		var isLoggedIn = Auth.isUserLoggedIn();
		$scope.isNewUser = false;
		$scope.isActive = false;
		$scope.mainActive = false;
		$scope.current, $scope.userPosts = [];

		$scope.colorToggles = [{
			name: 'blueSteel',
			state: false
		}, {
			name: 'periwinkle',
			state: false
		}, {
			name: 'citrus',
			state: false
		}, {
			name: 'seaGreen',
			state: false
		}, {
			name: 'peach',
			state: false
		}, {
			name: 'frost',
			state: false
		}, {
			name: 'butter',
			state: false
		}, {
			name: 'yellow',
			state: false
		}, ]

		$scope.toggleActive = function(currentBtn) {
			if ($scope.mainActive) {
				if (currentBtn === $scope.current) {
					currentBtn.state = !currentBtn.state;
					$scope.mainActive = false;
				} else {
					alert("You've already chosen a color!");
				}
			} else {
				$scope.mainActive = true;
				$scope.current = currentBtn;
				currentBtn.state = !currentBtn.state;
			}
		}

		var previousUserPosts = function() {
			Post.getUserPreviousPosts({
					userId: userId
				})
				.then(function(data) {
					if (data.isNewUser) {
						$scope.isNewUser = true;
					} else {
						$scope.isNewUser = false;
						$scope.numberOfUserPosts = data.allUserPosts.numberOfPosts;
						$scope.userPosts = data.allUserPosts.allposts;
						console.log($scope.userPosts);

					}

				})
				.catch(function() {
					console.log("Error occured in HomeController");
				})
		}


		$scope.postMessage = function() {
			Post.postUserMessage({
					postMessage: $scope.userPost,
					userId: userId,
					postId: $scope.numberOfUserPosts + 1,
					challengeID: $stateParams.challengeID
				})
				.then(function(data) {
					$scope.isNewUser = false;
					$scope.postForm.$setPristine();
					$scope.userPost = '';
					$scope.userPosts.unshift({
						'postId': $scope.numberOfPosts + 1,
						'postMessage': data.userPosts.postedMessage
					});
				})
				.catch(function() {
					console.log("error");
				})
		}

		$scope.deletePost = function() {
			var toDelete = this.post.postId;
			delete $scope.userPosts[this.post.postId - 1];

			Post.deleteUserPost({
				postId: toDelete,
				userId: userId
			});
		}

		$scope.activeButton = function() {
			$scope.isActive = !$scope.isActive;
		}

		$scope.submitChallengeDetails = function() {
			$scope.currentUserChallenges.length;
			User.saveNewChallenge(userId, {
					cID: $scope.currentUserChallenges.length+1,
					cTitle: $scope.cTitle,
					cColor: $scope.current.name,
					cDays: $scope.cDays,
					cDate: $scope.cDate,
					penalty: $scope.cPenalty
				})
				.then(function(data) {
					var c = data.userSavedWithChallenge.savedChallenge;
					$scope.currentUserChallenges.push({
						id: c.id,
						color: c.color,
						date: c.date,
						days: c.days,
						title: c.title
					});
					console.log($scope.currentUserChallenges);
					$location.path('/home/user/posts/'+c.id);
				})
				.catch(function() {
					console.log("Error saving the challenge");
				})
		}
		previousUserPosts();

	}]);