import React, { Component } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import { Divider } from 'material-ui';
import R from 'ramda';
import SongSearch from '../SongSearch';
import { PLAYLIST, SEARCH, QUEUE } from '../../modules/misc/constants';
import styles from './PlaylistBuilder.css';
import SongSearchListItem from '../SongSearchListItem';
import { Scrollbars } from 'react-custom-scrollbars';

export default class PlaylistBuilder extends Component {
  static propTypes = {
    playlists: React.PropTypes.array.isRequired,
    songNavSelection: React.PropTypes.string.isRequired,
    activePlaylist: React.PropTypes.array.isRequired,
    songs: React.PropTypes.array.isRequired,
    searchResults: React.PropTypes.array.isRequired,
    canAddSongToPlaylist: React.PropTypes.func.isRequired,
    onSearch: React.PropTypes.func.isRequired,
    onAddSongToPlaylist: React.PropTypes.func.isRequired,
    onCreatePlaylist: React.PropTypes.func.isRequired,
    onPreview: React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      playlistNameInputValue: '',
    };
  }

  shouldComponentUpdate = (nextProps, nextState) =>
    shallowCompare(this, nextProps, nextState)

  handleSearch = (query) => {
    const { onSearch } = this.props;
    this.setState({ selectedPlaylist: null });
    onSearch(query);
  }

  renderSong = (song, playlists, canAddSongToPlaylist, onAddSongToPlaylist) => {
    const { onPreview } = this.props;
    return (
      <SongSearchListItem
        key={song.id}
        song={song}
        playlists={playlists}
        canAddSongToPlaylist={canAddSongToPlaylist}
        onAddSongToPlaylist={onAddSongToPlaylist}
        onPreview={onPreview}
      />
    );
  }

  renderPlaylistSongs = () => {
    const {
      playlists,
      songs,
      canAddSongToPlaylist,
      onAddSongToPlaylist,
      activePlaylist,
    } = this.props;

    if (activePlaylist.songs.size) {
      return activePlaylist.songs
      .map(songId => R.find(song => song.id === songId)(songs))
      .map(song => this.renderSong(song, playlists, canAddSongToPlaylist, onAddSongToPlaylist));
    }
    return <div>No songs yet :(</div>;
  }

  renderSearchResults = () => {
    const {
      searchResults,
      playlists,
      canAddSongToPlaylist,
      onAddSongToPlaylist,
    } = this.props;

    if (searchResults && searchResults.length > 0) {
      return searchResults.map(song =>
        this.renderSong(song, playlists, canAddSongToPlaylist, onAddSongToPlaylist)
      );
    }
    return <div>No Results</div>;
  }

  renderSongs = () => {
    const { songNavSelection } = this.props;
    switch (songNavSelection) {
      case PLAYLIST:
        return this.renderPlaylistSongs();
      case SEARCH:
        return this.renderSearchResults();
      default:
        return <div>Error</div>;
    }
  }

  render() {

    return (
      <div className={styles.container}>
        <div className={styles.searchContainer}>
          <SongSearch className={styles.searchBar} onSearch={this.handleSearch} />
          <Divider style={{ marginLeft: '10px', marginRight: '10px' }} />
        </div>
        <Scrollbars className={styles.songResults}>
            {this.renderSongs()}
        </Scrollbars>
      </div>
    );
  }
}
