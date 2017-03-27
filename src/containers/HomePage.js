import React from 'react';
import { connect } from 'react-redux';
import { getLogs, uploadSourceMap } from '../actions/log';

class HomePage extends React.Component {
  static propTypes = {
    logs: React.PropTypes.object,
    xUserId: React.PropTypes.string,
    getLogs: React.PropTypes.func,
    uploadSourceMap: React.PropTypes.func
  }

  constructor(props) {
    super(props);

    this.uploadFile = this.uploadFile.bind(this);
  }

  componentWillMount() {
    this.props.getLogs();
  }

  uploadFile(e) {
    this.props.uploadSourceMap(e.target.files[0]);
  }

  render() {
    return (
      <div>
        <div>
          Upload SourceMap Here:
          <input type="file" name="sourcemap" onChange={this.uploadFile} />
        </div>
        <div>
          Or make a POST request to: <b>https://us-central1-js-exception-logger.cloudfunctions.net/uploadSourceMap</b>
          <div>
            With headers:
          </div>
          <ol>
            <li>x-user-id => {this.props.xUserId}</li>
            <li>x-file-name => "the file name"</li>
            <li>Content-Type => application/octet-stream</li>
          </ol>

        </div>
        <div>
          <table>
            <thead>
              <tr>
                <th>Parsed Trace</th>
                <th>Original Trace</th>
              </tr>
            </thead>
            <tbody>
              {
                Object.keys(this.props.logs).map((key) => {
                  const log = this.props.logs[key];
                  return (
                    <tr key={key}>
                      <td>
                        <div className="pre">
                          {(log.traces || []).join('\n')}
                        </div>
                      </td>
                      <td>
                        <div className="pre">
                          {log.originalTrace.message}
                          {log.originalTrace.stack}
                        </div>
                      </td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>

      </div>
    );
  }
}

function mapStateToProps(state) {
  const { log, auth } = state;

  return {
    logs: log.logs,
    xUserId: auth.xUserId
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getLogs: () => {
      dispatch(getLogs());
    },
    uploadSourceMap: (file) => {
      dispatch(uploadSourceMap(file));
    }
  };
}



export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
